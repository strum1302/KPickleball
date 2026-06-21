using KPickleball.Domain.Common;
using KPickleball.Domain.Enums;

namespace KPickleball.Domain.Entities;

public class Post : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public BoardCategory Category { get; set; }
    public int ViewCount { get; set; } = 0;
    public bool IsPinned { get; set; } = false;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<PostLike> Likes { get; set; } = new List<PostLike>();
    public ICollection<PostAttachment> Attachments { get; set; } = new List<PostAttachment>();
}

public class Comment : BaseEntity
{
    public string Content { get; set; } = string.Empty;
    public int? ParentCommentId { get; set; }

    public int PostId { get; set; }
    public Post Post { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public Comment? ParentComment { get; set; }
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();
}

public class PostLike : BaseEntity
{
    public int PostId { get; set; }
    public Post Post { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}

public class PostAttachment : BaseEntity
{
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public long FileSize { get; set; }

    public int PostId { get; set; }
    public Post Post { get; set; } = null!;
}
