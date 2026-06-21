using KPickleball.Domain.Common;
using KPickleball.Domain.Enums;

namespace KPickleball.Domain.Entities;

// ── Club ──────────────────────────────────────────
public class Club : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string State { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public int MaxMembers { get; set; } = 50;
    public bool IsPublic { get; set; } = true;

    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    public ICollection<ClubMember> Members { get; set; } = new List<ClubMember>();
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}

public class ClubMember : BaseEntity
{
    public ClubMemberRole Role { get; set; } = ClubMemberRole.Member;
    public ClubMemberStatus Status { get; set; } = ClubMemberStatus.Pending;
    public DateTime? ApprovedAt { get; set; }

    public int ClubId { get; set; }
    public Club Club { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}

// ── Video ──────────────────────────────────────────
public class Video : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string YouTubeVideoId { get; set; } = string.Empty;  // YouTube video ID
    public string ThumbnailUrl { get; set; } = string.Empty;
    public VideoCategory Category { get; set; }
    public int ViewCount { get; set; } = 0;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}

// ── Tournament ─────────────────────────────────────
public class Tournament : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime RegistrationDeadline { get; set; }
    public decimal EntryFee { get; set; }
    public int MaxParticipants { get; set; }
    public TournamentStatus Status { get; set; } = TournamentStatus.Upcoming;

    public int OrganizerId { get; set; }
    public User Organizer { get; set; } = null!;

    public ICollection<TournamentEntry> Entries { get; set; } = new List<TournamentEntry>();
}

public class TournamentEntry : BaseEntity
{
    public EntryStatus Status { get; set; } = EntryStatus.Pending;
    public string? StripePaymentId { get; set; }
    public bool IsPaid { get; set; } = false;

    public int TournamentId { get; set; }
    public Tournament Tournament { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}

// ── Court ──────────────────────────────────────────
public class Court : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int NumberOfCourts { get; set; }
    public bool IsIndoor { get; set; }
    public bool IsFree { get; set; }
    public string? Notes { get; set; }

    public ICollection<CourtReview> Reviews { get; set; } = new List<CourtReview>();
}

public class CourtReview : BaseEntity
{
    public int Rating { get; set; }  // 1~5
    public string? Comment { get; set; }

    public int CourtId { get; set; }
    public Court Court { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
