using KPickleball.Application.DTOs;
using KPickleball.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KPickleball.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
        => _authService = authService;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto dto)
    {
        var result = await _authService.RefreshTokenAsync(dto.RefreshToken);
        return Ok(result);
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        var result = await _authService.GoogleLoginAsync(dto.IdToken);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);
        var nickname = User.FindFirstValue(ClaimTypes.Name);
        var role = User.FindFirstValue(ClaimTypes.Role);
        return Ok(new { userId, email, nickname, role });
    }
}

// ── Posts Controller ─────────────────────────────
[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IPostRepository _postRepo;
    private readonly KPickleball.Infrastructure.Data.AppDbContext _db;
    public PostsController(IPostRepository postRepo, KPickleball.Infrastructure.Data.AppDbContext db)
    {
        _postRepo = postRepo;
        _db = db;
    }
        

    [HttpGet]
    public async Task<IActionResult> GetPosts(
        [FromQuery] KPickleball.Domain.Enums.BoardCategory? category,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var (posts, total) = await _postRepo.GetPagedAsync(category, page, pageSize);
        var items = posts.Select(p => new PostListDto(
            p.Id, p.Title, p.User?.Nickname ?? "",
            p.Category, p.ViewCount,
            p.Likes?.Count ?? 0, p.Comments?.Count ?? 0,
            p.IsPinned, p.CreatedAt
        )).ToList();

        return Ok(new PagedResultDto<PostListDto>(
            items, total, page, pageSize,
            (int)Math.Ceiling(total / (double)pageSize)));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPost(int id)
    {
        var post = await _postRepo.GetWithDetailsAsync(id);
        if (post == null) return NotFound();

        var myId = int.TryParse(
            User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : 0;

        var dto = new PostDetailDto(
            post.Id, post.Title, post.Content,
            post.User.Nickname, post.User.ProfileImageUrl,
            post.Category, post.ViewCount,
            post.Likes?.Count ?? 0, post.IsPinned,
            post.Likes?.Any(l => l.UserId == myId) ?? false,
            post.CreatedAt,
            MapComments(post.Comments?.Where(c => c.ParentCommentId == null).ToList()),
            post.Attachments?.Select(a => new AttachmentDto(
                a.Id, a.FileName, a.FileUrl, a.FileSize)).ToList() ?? []
        );
        return Ok(dto);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var post = new KPickleball.Domain.Entities.Post
        {
            Title = dto.Title,
            Content = dto.Content,
            Category = dto.Category,
            UserId = userId
        };
        await _postRepo.AddAsync(post);
        await _postRepo.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post.Id);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(int id, [FromBody] UpdatePostDto dto)
    {
        var post = await _postRepo.GetByIdAsync(id);
        if (post == null) return NotFound();

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (post.UserId != userId) return Forbid();

        post.Title = dto.Title;
        post.Content = dto.Content;
        await _postRepo.UpdateAsync(post);
        await _postRepo.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var post = await _postRepo.GetByIdAsync(id);
        if (post == null) return NotFound();

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role);
        if (post.UserId != userId && role != "Admin") return Forbid();

        post.IsDeleted = true;
        await _postRepo.SaveChangesAsync();
        return NoContent();
    }


    // ── 댓글 작성 ─────────────────────────────────────
    [Authorize]
    [HttpPost("{postId}/comments")]
    public async Task<IActionResult> CreateComment(int postId, [FromBody] CreateCommentDto dto)
    {
        var post = await _postRepo.GetByIdAsync(postId);
        if (post == null) return NotFound();

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var comment = new KPickleball.Domain.Entities.Comment
        {
            Content = dto.Content,
            PostId = postId,
            UserId = userId,
            ParentCommentId = dto.ParentCommentId
        };

        await _db.Comments.AddAsync(comment);
        await _db.SaveChangesAsync();
        return Ok(new { message = "댓글이 등록됐습니다.", id = comment.Id });
    }

    // ── 댓글 삭제 ─────────────────────────────────────
    [Authorize]
    [HttpDelete("{postId}/comments/{commentId}")]
    public async Task<IActionResult> DeleteComment(int postId, int commentId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var comment = await _db.Comments.FindAsync(commentId);
        if (comment == null) return NotFound();

        if (comment.UserId != userId && role != "Admin") return Forbid();

        comment.IsDeleted = true;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static List<CommentDto> MapComments(
        List<KPickleball.Domain.Entities.Comment>? comments) =>
        comments?.Select(c => new CommentDto(
            c.Id, c.Content, c.User?.Nickname ?? "",
            c.User?.ProfileImageUrl, c.ParentCommentId, c.CreatedAt,
            MapComments(c.Replies?.ToList())
        )).ToList() ?? [];
}

// ── Videos Controller ────────────────────────────
[ApiController]
[Route("api/[controller]")]
public class VideosController : ControllerBase
{
    private readonly IVideoRepository _videoRepo;
    private readonly IYouTubeService _youtubeService;

    public VideosController(IVideoRepository videoRepo, IYouTubeService youtubeService)
    {
        _videoRepo = videoRepo;
        _youtubeService = youtubeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetVideos(
        [FromQuery] KPickleball.Domain.Enums.VideoCategory? category,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var (videos, total) = await _videoRepo.GetPagedAsync(category, page, pageSize);
        var items = videos.Select(v => new VideoListDto(
            v.Id, v.Title, v.YouTubeVideoId, v.ThumbnailUrl,
            v.Category, v.User?.Nickname ?? "", v.ViewCount, v.CreatedAt
        )).ToList();

        return Ok(new PagedResultDto<VideoListDto>(
            items, total, page, pageSize,
            (int)Math.Ceiling(total / (double)pageSize)));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateVideo([FromBody] CreateVideoDto dto)
    {
        if (!_youtubeService.IsValidVideoId(dto.YouTubeVideoId))
            return BadRequest("Invalid YouTube video ID.");

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var thumbnail = await _youtubeService.GetThumbnailUrlAsync(dto.YouTubeVideoId)
            ?? dto.ThumbnailUrl;

        var video = new KPickleball.Domain.Entities.Video
        {
            Title = dto.Title,
            Description = dto.Description,
            YouTubeVideoId = dto.YouTubeVideoId,
            ThumbnailUrl = thumbnail,
            Category = dto.Category,
            UserId = userId
        };

        await _videoRepo.AddAsync(video);
        await _videoRepo.SaveChangesAsync();
        return CreatedAtAction(nameof(GetVideos), new { id = video.Id }, video.Id);
    }
}
