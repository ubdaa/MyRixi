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
    
    public DbSet<MainProfile> Profiles { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<CommunityProfile> CommunityProfiles { get; set; }
    public DbSet<CommunityRole> CommunityRoles { get; set; }
    public DbSet<Community> Communities { get; set; }
    public DbSet<Channel> Channels { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Media> Medias { get; set; }
    public DbSet<Attachment> Attachments { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<MessageReaction> MessageReactions { get; set; }
    public DbSet<CommunityRule> CommunityRules { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }
    public DbSet<CommunityProfileRole> CommunityProfileRoles { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresExtension("uuid-ossp");

        // Profiles
        modelBuilder.Entity<MainProfile>()
            .HasDiscriminator<string>("ProfileType")
            .HasValue<UserProfile>("UserProfile")
            .HasValue<CommunityProfile>("CommunityProfile");

        modelBuilder.Entity<MainProfile>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Id).HasDefaultValueSql("uuid_generate_v4()");
            
            entity.HasOne(p => p.ProfilePicture)
                .WithMany()
                .HasForeignKey(p => p.ProfilePictureId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(p => p.CoverPicture)
                .WithMany()
                .HasForeignKey(p => p.CoverPictureId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(up => up.User)
                .WithOne(u => u.UserProfile)
                .HasForeignKey<UserProfile>(up => up.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        modelBuilder.Entity<CommunityProfile>(entity =>
        {
            entity.HasOne(cp => cp.Community)
                .WithMany(c => c.Members)
                .HasForeignKey(cp => cp.CommunityId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // roles
        modelBuilder.Entity<RolePermission>(entity =>
            {
                entity.HasKey(rp => new { rp.RoleId, rp.PermissionId });
                
                entity.HasOne(rp => rp.Role)
                    .WithMany(r => r.RolePermissions)
                    .HasForeignKey(rp => rp.RoleId);
                    
                entity.HasOne(rp => rp.Permission)
                    .WithMany()
                    .HasForeignKey(rp => rp.PermissionId);
            }
        );
        
        modelBuilder.Entity<CommunityProfileRole>(entity =>
        {
            entity.HasKey(cpr => new { cpr.CommunityProfileId, cpr.CommunityRoleId });

            entity.HasOne(cpr => cpr.CommunityProfile)
                .WithMany(cp => cp.ProfileRoles)
                .HasForeignKey(cpr => cpr.CommunityProfileId);

            entity.HasOne(cpr => cpr.CommunityRole)
                .WithMany(cmr => cmr.ProfileRoles)
                .HasForeignKey(cpr => cpr.CommunityRoleId);
        });

        modelBuilder.Entity<CommunityRole>(entity =>
        {
            entity.HasKey(cr => cr.Id);
            entity.Property(cr => cr.Id).HasDefaultValueSql("uuid_generate_v4()");

            entity.HasOne(cr => cr.Community)
                .WithMany(c => c.Roles)
                .HasForeignKey(cr => cr.CommunityId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // commentaires
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(c => c.Profile)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.ProfileId)
                .OnDelete(DeleteBehavior.Restrict);
        });
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