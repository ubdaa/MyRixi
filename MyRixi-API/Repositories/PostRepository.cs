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

    public async Task<IEnumerable<Post>> GetPostsAsync(Guid communityId, int page, int size)
    {
        var posts = await _context.Posts
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.User)
            .Where(p => p.CommunityId == communityId)
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
            .FirstOrDefaultAsync(p => p.Id == postId);
    }

    public async Task<IEnumerable<Post>> SearchAsync(string searchTerm)
    {
        var posts = await _context.Posts
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.User)
            .Where(p => p.Content.ToLower().Contains(searchTerm.ToLower()) || p.Title.ToLower().Contains(searchTerm.ToLower()))
            .ToListAsync();
        
        return posts;
    }

    public async Task<IEnumerable<Post>> GetPostsByUserAsync(Guid userId)
    {
        var posts = await _context.Posts
            .Include(p => p.CommunityProfile)
            .ThenInclude(p => p.User)
            .Include(p => p.Community)
            .Where(p => p.CommunityProfile.UserId == userId)
            .ToListAsync();
        
        return posts;
    }
}