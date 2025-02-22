using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyRixiApi.Models;

namespace MyRixiApi.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<CommunityProfile> CommunityProfiles { get; set; }
    public DbSet<Community> Communities { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Attachment> Attachments { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
            
        modelBuilder.Entity<UserProfile>()
            .HasOne(up => up.User)
            .WithOne(u => u.UserProfile)
            .HasForeignKey<UserProfile>(up => up.UserId);

        modelBuilder.Entity<CommunityProfile>()
            .HasOne(cp => cp.User)
            .WithMany(u => u.CommunityProfiles)
            .HasForeignKey(cp => cp.UserId);

        modelBuilder.Entity<CommunityProfile>()
            .HasOne(cp => cp.Community)
            .WithMany(c => c.Members)
            .HasForeignKey(cp => cp.CommunityId);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.ParentComment)
            .WithMany(c => c.Replies)
            .HasForeignKey(c => c.ParentCommentId);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.Messages)
            .HasForeignKey(m => m.UserId);

        modelBuilder.Entity<Conversation>()
            .HasMany(c => c.Participants)
            .WithMany();
    }
}