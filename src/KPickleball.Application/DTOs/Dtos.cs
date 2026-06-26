using KPickleball.Domain.Enums;

namespace KPickleball.Application.DTOs;

// ── Post ──────────────────────────────────────────
public record PostListDto(
    int Id,
    string Title,
    string AuthorNickname,
    BoardCategory Category,
    int ViewCount,
    int LikeCount,
    int CommentCount,
    bool IsPinned,
    DateTime CreatedAt
);

public record PostDetailDto(
    int Id,
    string Title,
    string Content,
    string AuthorNickname,
    string? AuthorProfileImageUrl,
    BoardCategory Category,
    int ViewCount,
    int LikeCount,
    bool IsPinned,
    bool IsLikedByMe,
    DateTime CreatedAt,
    List<CommentDto> Comments,
    List<AttachmentDto> Attachments
);

public record CreatePostDto(
    string Title,
    string Content,
    BoardCategory Category
);

public record UpdatePostDto(
    string Title,
    string Content
);

public record CommentDto(
    int Id,
    string Content,
    string AuthorNickname,
    string? AuthorProfileImageUrl,
    int? ParentCommentId,
    DateTime CreatedAt,
    List<CommentDto> Replies
);

public record CreateCommentDto(
    string Content,
    int? ParentCommentId
);

public record AttachmentDto(
    int Id,
    string FileName,
    string FileUrl,
    long FileSize
);

// ── Video ──────────────────────────────────────────
public record VideoListDto(
    int Id,
    string Title,
    string YouTubeVideoId,
    string ThumbnailUrl,
    VideoCategory Category,
    string AuthorNickname,
    int ViewCount,
    DateTime CreatedAt
);

public record VideoDetailDto(
    int Id,
    string Title,
    string Description,
    string YouTubeVideoId,
    string ThumbnailUrl,
    VideoCategory Category,
    string AuthorNickname,
    int ViewCount,
    DateTime CreatedAt
);

public record CreateVideoDto(
    string Title,
    string Description,
    string YouTubeVideoId,
    string ThumbnailUrl,
    VideoCategory Category
);

// ── Club ──────────────────────────────────────────
public record ClubListDto(
    int Id,
    string Name,
    string? LogoUrl,
    string State,
    string City,
    int MemberCount,
    int MaxMembers,
    bool IsPublic,
    DateTime CreatedAt
);

public record ClubDetailDto(
    int Id,
    string Name,
    string Description,
    string? LogoUrl,
    string State,
    string City,
    int MemberCount,
    int MaxMembers,
    bool IsPublic,
    string OwnerNickname,
    string? MyMemberStatus,
    DateTime CreatedAt
);

public record CreateClubDto(
    string Name,
    string Description,
    string State,
    string City,
    int MaxMembers,
    bool IsPublic
);

// ── Tournament ─────────────────────────────────────
public record TournamentListDto(
    int Id,
    string Name,
    string State,
    string City,
    DateTime StartDate,
    DateTime RegistrationDeadline,
    decimal EntryFee,
    int MaxParticipants,
    int CurrentEntries,
    string Status
);

public record CreateTournamentDto(
    string Name,
    string Description,
    string State,
    string City,
    string Venue,
    DateTime StartDate,
    DateTime EndDate,
    DateTime RegistrationDeadline,
    decimal EntryFee,
    int MaxParticipants
);

// ── Common ─────────────────────────────────────────
public record PagedResultDto<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
);
public record CourtListDto(
    int Id,
    string Name,
    string Address,
    string State,
    string City,
    double Latitude,
    double Longitude,
    int NumberOfCourts,
    bool IsIndoor,
    bool IsFree,
    int ReviewCount,
    double AverageRating
);

public record CourtDetailDto(
    int Id,
    string Name,
    string Address,
    string State,
    string City,
    double Latitude,
    double Longitude,
    int NumberOfCourts,
    bool IsIndoor,
    bool IsFree,
    string? Notes,
    int ReviewCount,
    double AverageRating,
    List<CourtReviewDto> Reviews
);

public record CourtReviewDto(
    int Rating,
    string? Comment,
    int UserId
);