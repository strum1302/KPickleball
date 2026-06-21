using KPickleball.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace KPickleball.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<PostLike> PostLikes => Set<PostLike>();
    public DbSet<PostAttachment> PostAttachments => Set<PostAttachment>();
    public DbSet<Club> Clubs => Set<Club>();
    public DbSet<ClubMember> ClubMembers => Set<ClubMember>();
    public DbSet<Video> Videos => Set<Video>();
    public DbSet<Tournament> Tournaments => Set<Tournament>();
    public DbSet<TournamentEntry> TournamentEntries => Set<TournamentEntry>();
    public DbSet<Court> Courts => Set<Court>();
    public DbSet<CourtReview> CourtReviews => Set<CourtReview>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Nickname).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256);
            e.Property(u => u.Nickname).HasMaxLength(50);
        });

        // Post
        modelBuilder.Entity<Post>(e =>
        {
            e.HasOne(p => p.User).WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.Restrict);
            e.Property(p => p.Title).HasMaxLength(200);
            e.HasQueryFilter(p => !p.IsDeleted);
        });

        // Comment
        modelBuilder.Entity<Comment>(e =>
        {
            e.HasOne(c => c.Post).WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(c => c.ParentComment).WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId).OnDelete(DeleteBehavior.Restrict);
            e.HasQueryFilter(c => !c.IsDeleted);
        });

        // PostLike - unique constraint
        modelBuilder.Entity<PostLike>(e =>
        {
            e.HasIndex(l => new { l.PostId, l.UserId }).IsUnique();
        });

        // Club
        modelBuilder.Entity<Club>(e =>
        {
            e.HasOne(c => c.Owner).WithMany()
                .HasForeignKey(c => c.OwnerId).OnDelete(DeleteBehavior.Restrict);
            e.HasQueryFilter(c => !c.IsDeleted);
        });

        // ClubMember - unique constraint
        modelBuilder.Entity<ClubMember>(e =>
        {
            e.HasIndex(m => new { m.ClubId, m.UserId }).IsUnique();
        });

        // Video
        modelBuilder.Entity<Video>(e =>
        {
            e.HasOne(v => v.User).WithMany(u => u.Videos)
                .HasForeignKey(v => v.UserId).OnDelete(DeleteBehavior.Restrict);
            e.Property(v => v.YouTubeVideoId).HasMaxLength(20);
            e.HasQueryFilter(v => !v.IsDeleted);
        });

        // Tournament
        modelBuilder.Entity<Tournament>(e =>
        {
            e.Property(t => t.EntryFee).HasColumnType("decimal(10,2)");
            e.HasQueryFilter(t => !t.IsDeleted);
        });

        // CourtReview - unique (one review per user per court)
        modelBuilder.Entity<CourtReview>(e =>
        {
            e.HasIndex(r => new { r.CourtId, r.UserId }).IsUnique();
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Auto-set UpdatedAt
        foreach (var entry in ChangeTracker.Entries<Domain.Common.BaseEntity>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
