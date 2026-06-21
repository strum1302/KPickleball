namespace KPickleball.Application.DTOs;

public record RegisterDto(
    string Email,
    string Password,
    string Nickname,
    string? State,
    string? City
);

public record LoginDto(
    string Email,
    string Password
);

public record AuthResponseDto(
    string AccessToken,
    string RefreshToken,
    UserDto User
);

public record UserDto(
    int Id,
    string Email,
    string Nickname,
    string? ProfileImageUrl,
    string? State,
    string? City,
    string Level,
    string Role
);

public record RefreshTokenDto(string RefreshToken);

public record GoogleLoginDto(string IdToken);
