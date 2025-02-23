using System.Text.Json;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Services;

public class MediaService : IMediaService
{
    private readonly ApplicationDbContext _context;
    private readonly IStorageService _storageService;
    
    public MediaService(ApplicationDbContext context, IStorageService storageService)
    {
        _context = context;
        _storageService = storageService;
    }
    
    public async Task<Media> UploadMediaAsync(IFormFile file)
    {
        var media = new Media
        {
            Id = Guid.NewGuid(),
            Type = GetMediaType(file.ContentType),
            Metadata = JsonSerializer.Serialize(new
            {
                fileName = file.FileName,
                contentType = file.ContentType,
                size = file.Length
            })
        };
        
        // Upload sur MinIO
        media.Url = await _storageService.UploadFileAsync(file, media.Type);
        
        // Sauvegarde en base de données
        _context.Medias.Add(media);
        await _context.SaveChangesAsync();
        
        return media;
    }
    
    public async Task DeleteMediaAsync(Guid id)
    {
        var media = await _context.Medias.FindAsync(id);
        if (media == null) return;
        
        // Suppression sur MinIO
        await _storageService.DeleteFileAsync(media.Url);
        
        // Suppression en base de données
        _context.Medias.Remove(media);
        await _context.SaveChangesAsync();
    }
    
    private string GetMediaType(string contentType)
    {
        if (contentType.StartsWith("image/")) return "image";
        if (contentType.StartsWith("video/")) return "video";
        if (contentType.StartsWith("audio/")) return "audio";
        return "other";
    }
}