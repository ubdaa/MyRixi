using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface IAttachmentRepository : IGenericRepository<Attachment>
{
    Task<Attachment> CreatePostAttachmentAsync(Guid postId, Guid mediaId);
    Task<Attachment> CreateCommentAttachmentAsync(Guid commentId, Guid mediaId);
    
    Task<IEnumerable<Attachment>> GetPostAttachmentsAsync(Guid postId);
}