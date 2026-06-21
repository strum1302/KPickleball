using KPickleball.Application.DTOs;
using KPickleball.Domain.Entities;

namespace KPickleball.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
    Task<AuthResponseDto> GoogleLoginAsync(string idToken);
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    int? GetUserIdFromToken(string token);
}

public interface IEmailService
{
    Task SendVerificationEmailAsync(string email, string token);
    Task SendPasswordResetEmailAsync(string email, string token);
}

public interface IFileService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType);
    Task DeleteAsync(string fileUrl);
}

public interface IYouTubeService
{
    Task<string?> GetThumbnailUrlAsync(string videoId);
    bool IsValidVideoId(string videoId);
}
