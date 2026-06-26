using KPickleball.Application.Interfaces;
using KPickleball.Domain.Entities;
using KPickleball.Domain.Enums;
using KPickleball.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace KPickleball.Infrastructure.Repositories;

// ── Base Repository ───────────────────────────────
public class Repository<T> : IRepository<T> where T : Domain.Common.BaseEntity
{
    protected readonly AppDbContext _db;
    protected readonly DbSet<T> _set;

    public Repository(AppDbContext db)
    {
        _db = db;
        _set = db.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id)
        => await _set.FirstOrDefaultAsync(e => e.Id == id);

    public async Task<IEnumerable<T>> GetAllAsync()
        => await _set.ToListAsync();

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        => await _set.Where(predicate).ToListAsync();

    public async Task<T> AddAsync(T entity)
    {
        await _set.AddAsync(entity);
        return entity;
    }

    public Task UpdateAsync(T entity)
    {
        _set.Update(entity);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(T entity)
    {
        _set.Remove(entity);
        return Task.CompletedTask;
    }

    public async Task<int> SaveChangesAsync()
        => await _db.SaveChangesAsync();
}


// ── User Repository ───────────────────────────────
public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext db) : base(db) { }

    public async Task<User?> GetByEmailAsync(string email)
        => await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<User?> GetByGoogleIdAsync(string googleId)
        => await _db.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);

    public async Task<bool> EmailExistsAsync(string email)
        => await _db.Users.AnyAsync(u => u.Email == email);

    public async Task<bool> NicknameExistsAsync(string nickname)
        => await _db.Users.AnyAsync(u => u.Nickname == nickname);
}
public class CourtRepository : Repository<Court>, ICourtRepository
{
    // 한 줄 생성자 패턴 적용
    public CourtRepository(AppDbContext db) : base(db) { }

    public async Task<(List<Court> Courts, int Total)> GetPagedAsync(string? state, int page, int pageSize)
    {
        var query = _db.Courts.Include(c => c.Reviews).AsQueryable();

        if (!string.IsNullOrWhiteSpace(state))
            query = query.Where(c => c.State.ToLower() == state.ToLower());

        int total = await query.CountAsync();
        var courts = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return (courts, total);
    }
}


// ── Post Repository ───────────────────────────────
public class PostRepository : Repository<Post>, IPostRepository
{
    public PostRepository(AppDbContext db) : base(db) { }

    public async Task<(List<Post> Posts, int Total)> GetPagedAsync(
        BoardCategory? category, int page, int pageSize)
    {
        var query = _db.Posts
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .AsQueryable();

        if (category.HasValue)
            query = query.Where(p => p.Category == category.Value);

        query = query.OrderByDescending(p => p.IsPinned)
                     .ThenByDescending(p => p.CreatedAt);

        var total = await query.CountAsync();
        var posts = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (posts, total);
    }

    public async Task<Post?> GetWithDetailsAsync(int id)
        => await _db.Posts
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Attachments)
            .Include(p => p.Comments.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.User)
            .Include(p => p.Comments.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.Replies.Where(r => !r.IsDeleted))
                    .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(p => p.Id == id);
}

// ── Video Repository ──────────────────────────────
public class VideoRepository : Repository<Video>, IVideoRepository
{
    public VideoRepository(AppDbContext db) : base(db) { }

    public async Task<(List<Video> Videos, int Total)> GetPagedAsync(
        VideoCategory? category, int page, int pageSize)
    {
        var query = _db.Videos
            .Include(v => v.User)
            .AsQueryable();

        if (category.HasValue)
            query = query.Where(v => v.Category == category.Value);

        query = query.OrderByDescending(v => v.CreatedAt);

        var total = await query.CountAsync();
        var videos = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (videos, total);
    }
}

// ── Club Repository ───────────────────────────────
public class ClubRepository : Repository<Club>, IClubRepository
{
    public ClubRepository(AppDbContext db) : base(db) { }

    public async Task<(List<Club> Clubs, int Total)> GetPagedAsync(
        string? state, int page, int pageSize)
    {
        var query = _db.Clubs
            .Include(c => c.Owner)
            .Include(c => c.Members)
            .AsQueryable();

        if (!string.IsNullOrEmpty(state))
            query = query.Where(c => c.State == state);

        query = query.OrderByDescending(c => c.CreatedAt);

        var total = await query.CountAsync();
        var clubs = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (clubs, total);
    }

    public async Task<Club?> GetWithMembersAsync(int id)
        => await _db.Clubs
            .Include(c => c.Owner)
            .Include(c => c.Members)
                .ThenInclude(m => m.User)
            .FirstOrDefaultAsync(c => c.Id == id);
}

// ── Tournament Repository ─────────────────────────
public class TournamentRepository : Repository<Tournament>, ITournamentRepository
{
    public TournamentRepository(AppDbContext db) : base(db) { }

    public async Task<(List<Tournament> Tournaments, int Total)> GetPagedAsync(
        string? state, int page, int pageSize)
    {
        var query = _db.Tournaments
            .Include(t => t.Organizer)
            .Include(t => t.Entries)
            .AsQueryable();

        if (!string.IsNullOrEmpty(state))
            query = query.Where(t => t.State == state);

        query = query.OrderByDescending(t => t.StartDate);

        var total = await query.CountAsync();
        var tournaments = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (tournaments, total);
    }
}
