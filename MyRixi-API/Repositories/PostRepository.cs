using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class PostRepository : GenericRepository<Post>, IPostRepository
{
    public PostRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Post> CreateDraftAsync(Guid communityId, Guid communityProfileId)
    {
        var post = new Post
        {
            CommunityId = communityId,
            CommunityProfileId = communityProfileId,
            Title = "New Post",
            Content = "Write your content here...",
            State = PostState.Draft
        };

        await _context.Posts.AddAsync(post);
        await _context.SaveChangesAsync();

        return post;
    }

    public async Task<IEnumerable<Post>> GetUserDrafts(Guid communityId, Guid userId)
    {
        return await _context.Posts
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.User)
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.ProfilePicture)
            .Where(p => p.CommunityId == communityId && p.CommunityProfile.UserId == userId && p.State == PostState.Draft)
            .ToListAsync();
    }

    public async Task<IEnumerable<Post>> GetPostsAsync(PostState state, Guid communityId, int page, int size)
    {
        var posts = await _context.Posts
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.User)
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.ProfilePicture)
            .Where(p => p.CommunityId == communityId && p.State == state)
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync();
        
        return posts;
    }

    public async Task<IEnumerable<Post>> GetPostsAsync(Guid communityId, Guid userId, int page, int size)
    {
        var posts = await _context.Posts
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.User)
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.ProfilePicture)
            .Where(p => p.CommunityId == communityId && p.CommunityProfile.UserId == userId)
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync();
        
        return posts;
    }

    public async Task<Post?> GetPostAsync(Guid postId)
    {
        return await _context.Posts
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.User)
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.ProfilePicture)
            .Include(p => p.Attachments)
            .ThenInclude(a => a.Media)
            .Include(p => p.Tags)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Id == postId);
    }

    public async Task<IEnumerable<Post>> SearchAsync(string searchTerm)
    {
        var posts = await _context.Posts
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.User)
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.ProfilePicture)
            .Where(p => p.Content.ToLower().Contains(searchTerm.ToLower()) || p.Title.ToLower().Contains(searchTerm.ToLower()))
            .ToListAsync();
        
        return posts;
    }

    public async Task<IEnumerable<Post>> GetPostsByUserAsync(Guid userId)
    {
        var posts = await _context.Posts
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.User)
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.ProfilePicture)
            .Include(p => p.Community)
            .Where(p => p.CommunityProfile.UserId == userId)
            .ToListAsync();
        
        return posts;
    }
}