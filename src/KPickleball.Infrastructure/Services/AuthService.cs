using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Google.Apis.Auth;
using KPickleball.Application.DTOs;
using KPickleball.Application.Interfaces;
using KPickleball.Domain.Entities;
using KPickleball.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace KPickleball.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IConfiguration _config;

    public AuthService(IUserRepository userRepo, IConfiguration config)
    {
        _userRepo = userRepo;
        _config = config;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await _userRepo.EmailExistsAsync(dto.Email))
            throw new InvalidOperationException("Email already in use.");

        if (await _userRepo.NicknameExistsAsync(dto.Nickname))
            throw new InvalidOperationException("Nickname already in use.");

        var user = new User
        {
            Email = dto.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Nickname = dto.Nickname,
            State = dto.State,
            City = dto.City,
            Role = UserRole.Member,
            MemberStatus = MemberStatus.Pending  // ← 추가
        };

        user.RefreshToken = GenerateRefreshToken();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);

        await _userRepo.AddAsync(user);
        await _userRepo.SaveChangesAsync();

        return BuildAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email.ToLower())
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        // ← 추가
        if (user.MemberStatus == MemberStatus.Pending)
            throw new UnauthorizedAccessException("가입 승인 대기 중입니다. 관리자 승인 후 이용 가능합니다.");

        if (user.MemberStatus == MemberStatus.Rejected)
            throw new UnauthorizedAccessException("가입이 거절되었습니다. 관리자에게 문의하세요.");

        user.RefreshToken = GenerateRefreshToken();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);
        await _userRepo.SaveChangesAsync();

        return BuildAuthResponse(user);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        var users = await _userRepo.FindAsync(u => u.RefreshToken == refreshToken);
        var user = users.FirstOrDefault()
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");

        if (user.RefreshTokenExpiry < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token expired.");

        user.RefreshToken = GenerateRefreshToken();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);
        await _userRepo.SaveChangesAsync();

        return BuildAuthResponse(user);
    }

    public async Task<AuthResponseDto> GoogleLoginAsync(string idToken)
    {
        var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);

        var user = await _userRepo.GetByGoogleIdAsync(payload.Subject);

        if (user == null)
        {
            // 이메일로 기존 계정 확인
            user = await _userRepo.GetByEmailAsync(payload.Email);
            if (user != null)
            {
                user.GoogleId = payload.Subject;
            }
            else
            {
                // 신규 가입
                user = new User
                {
                    Email = payload.Email,
                    PasswordHash = string.Empty,
                    Nickname = payload.Name ?? payload.Email.Split('@')[0],
                    ProfileImageUrl = payload.Picture,
                    GoogleId = payload.Subject,
                    IsEmailVerified = true
                };
                await _userRepo.AddAsync(user);
            }
        }

        user.RefreshToken = GenerateRefreshToken();
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);
        await _userRepo.SaveChangesAsync();

        return BuildAuthResponse(user);
    }

    public string GenerateAccessToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Nickname),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_config["Jwt:ExpiryMinutes"] ?? "60")),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var bytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes);
    }

    private AuthResponseDto BuildAuthResponse(User user) => new(
        AccessToken: GenerateAccessToken(user),
        RefreshToken: user.RefreshToken!,
        User: new UserDto(
            user.Id, user.Email, user.Nickname,
            user.ProfileImageUrl, user.State, user.City,
            user.Level.ToString(), user.Role.ToString()
        )
    );
}
