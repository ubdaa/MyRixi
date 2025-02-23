using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface IMediaService
{
    Task<Media> UploadMediaAsync(IFormFile file);
    Task DeleteMediaAsync(Guid id);
}