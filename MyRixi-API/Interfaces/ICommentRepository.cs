using MyRixiApi.Models;
using MyRixiApi.Dto.Comment;

namespace MyRixiApi.Interfaces;

public interface ICommentRepository : IGenericRepository<Comment>
{
    Task<Comment?> GetCommentWithRepliesAsync(Guid commentId);
    Task<List<CommentDto>> GetCommentsByPostIdAsync(Guid postId, int page = 1, int pageSize = 10);
    Task<List<CommentDto>> GetCommentsByProfileIdAsync(Guid profileId, int page = 1, int pageSize = 10);
    Task<List<CommentDto>> GetRepliesByCommentIdAsync(Guid commentId, int page = 1, int pageSize = 10);
    Task<int> GetCommentsCountByPostIdAsync(Guid postId);
    Task<int> GetCommentsCountByProfileIdAsync(Guid profileId);
    Task<int> GetRepliesCountByCommentIdAsync(Guid commentId);
}