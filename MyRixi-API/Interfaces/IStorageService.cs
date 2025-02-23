namespace MyRixiApi.Interfaces;

public interface IStorageService
{
    Task<string> UploadFileAsync(IFormFile file, string prefix);
    Task<string> UploadFileAsync(Stream fileStream, string prefix, string fileName, string contentType);
    Task DeleteFileAsync(string fileUrl);
}