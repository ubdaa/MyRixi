using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyRixiApi.Models;

namespace MyRixiApi.Data;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<CommunityProfile> CommunityProfiles { get; set; }
    public DbSet<CommunityRule> CommunityRules { get; set; }
    public DbSet<Community> Communities { get; set; }
    public DbSet<Media> Medias { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Attachment> Attachments { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Tag> Tags { get; set; }

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
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Récupérez la chaîne de connexion d'une façon sécurisée
            optionsBuilder.UseNpgsql("Host=109.199.107.134;Port=5432;Database=postgres;Username=postgres;Password=EQikFXVrMtyP2G0mi1gmEyN4HBxNJPj3WO8a2CRE7RGgIhaFj4zoX4YGXMy3aEXc");
        }
    }
}