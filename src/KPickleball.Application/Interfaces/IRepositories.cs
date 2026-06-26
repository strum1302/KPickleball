using KPickleball.Domain.Common;
using System.Linq.Expressions;

namespace KPickleball.Application.Interfaces;

public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task<int> SaveChangesAsync();
}

public interface IUserRepository : IRepository<Domain.Entities.User>
{
    Task<Domain.Entities.User?> GetByEmailAsync(string email);
    Task<Domain.Entities.User?> GetByGoogleIdAsync(string googleId);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> NicknameExistsAsync(string nickname);
}

public interface IPostRepository : IRepository<Domain.Entities.Post>
{
    Task<(List<Domain.Entities.Post> Posts, int Total)> GetPagedAsync(
        Domain.Enums.BoardCategory? category, int page, int pageSize);
    Task<Domain.Entities.Post?> GetWithDetailsAsync(int id);
}

public interface IVideoRepository : IRepository<Domain.Entities.Video>
{
    Task<(List<Domain.Entities.Video> Videos, int Total)> GetPagedAsync(
        Domain.Enums.VideoCategory? category, int page, int pageSize);
}

public interface IClubRepository : IRepository<Domain.Entities.Club>
{
    Task<(List<Domain.Entities.Club> Clubs, int Total)> GetPagedAsync(
        string? state, int page, int pageSize);
    Task<Domain.Entities.Club?> GetWithMembersAsync(int id);
}

public interface ITournamentRepository : IRepository<Domain.Entities.Tournament>
{
    Task<(List<Domain.Entities.Tournament> Tournaments, int Total)> GetPagedAsync(
        string? state, int page, int pageSize);
}
public interface ICourtRepository  : IRepository<Domain.Entities.Court>  
{
   Task<IEnumerable<Domain.Entities.Court>> GetAllCourtsAsync(string? state);
    Task<Domain.Entities.Court?> GetCourtByIdAsync(int id);
}