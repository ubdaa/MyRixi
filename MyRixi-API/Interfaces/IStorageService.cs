namespace MyRixiApi.Interfaces;

public interface IStorageService
{
    Task<string> UploadFileAsync(IFormFile file, string prefix);
    Task DeleteFileAsync(string fileUrl);
}