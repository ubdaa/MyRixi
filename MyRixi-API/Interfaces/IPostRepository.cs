using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface IPostRepository : IGenericRepository<Post>
{
    Task<IEnumerable<Post>> GetPostsAsync(Guid communityId, int page, int size);
    Task<IEnumerable<Post>> GetPostsAsync(Guid communityId, Guid userId, int page, int size);
    Task<Post?> GetPostAsync(Guid postId);
    Task<IEnumerable<Post>> SearchAsync(string searchTerm);
    Task<IEnumerable<Post>> GetPostsByUserAsync(Guid userId);
}