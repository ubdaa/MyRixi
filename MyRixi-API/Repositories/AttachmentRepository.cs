using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class AttachmentRepository : GenericRepository<Attachment>, IAttachmentRepository
{
    public AttachmentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Attachment> CreatePostAttachmentAsync(Guid postId, Guid mediaId)
    {
        var attachment = new Attachment
        {
            PostId = postId,
            MediaId = mediaId
        };

        return await CreateAsync(attachment);
    }

    public async Task<Attachment> CreateCommentAttachmentAsync(Guid commentId, Guid mediaId)
    {
        var attachment = new Attachment
        {
            CommentId = commentId,
            MediaId = mediaId
        };

        return await CreateAsync(attachment);
    }

    public async Task<IEnumerable<Attachment>> GetPostAttachmentsAsync(Guid postId)
    {
        return await _context.Attachments.Where(a => a.PostId == postId).ToListAsync();
    }
}