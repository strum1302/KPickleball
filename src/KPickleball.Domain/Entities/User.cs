using KPickleball.Domain.Common;
using KPickleball.Domain.Enums;

namespace KPickleball.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Nickname { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public string? State { get; set; }           // 미국 주 (CA, NY, TX 등)
    public string? City { get; set; }
    public PlayerLevel Level { get; set; } = PlayerLevel.Beginner;
    public UserRole Role { get; set; } = UserRole.Member;
    public string? GoogleId { get; set; }
    public string? FacebookId { get; set; }
    public bool IsEmailVerified { get; set; } = false;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
    public MemberStatus MemberStatus { get; set; } = MemberStatus.Pending;

    // Navigation
    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<ClubMember> ClubMembers { get; set; } = new List<ClubMember>();
    public ICollection<Video> Videos { get; set; } = new List<Video>();
    public ICollection<TournamentEntry> TournamentEntries { get; set; } = new List<TournamentEntry>();
}
