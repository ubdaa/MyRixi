using System.Text.Json;
using ImageMagick;
using MyRixiApi.Data;
using MyRixiApi.Dto.Media;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Services;

public class MediaService : IMediaService
{
    private readonly ApplicationDbContext _context;
    private readonly IStorageService _storageService;
    
    // Seuil de résolution au-delà duquel on redimensionne (par exemple 2000 pixels)
    private const int WidthThreshold = 512;
    private const int HeightThreshold = 512;
    
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

        // Si le fichier est une image, on le convertit en WebP et on applique le redimensionnement
        if (media.Type == "image")
        {
            // Conversion de l'image en WebP avec redimensionnement si nécessaire
            var webpStream = await ConvertImageToWebPAsync(file);
            // Modification du nom de fichier pour l'extension .webp
            var fileName = Path.ChangeExtension(file.FileName, ".webp");
            media.Url = await _storageService.UploadFileAsync(webpStream, "image", fileName, "image/webp");
        }
        else
        {
            media.Url = await _storageService.UploadFileAsync(file, media.Type);
        }
            
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
    
    /// <summary>
    /// Convertit l'image fournie en WebP et redimensionne à 70% si l'image dépasse les seuils définis.
    /// </summary>
    private Task<Stream> ConvertImageToWebPAsync(IFormFile file)
    {
        using var inputStream = file.OpenReadStream();
        using var image = new MagickImage();
        image.Read(inputStream);
            
        // Si l'image dépasse le seuil, on redimensionne à 70% de ses dimensions
        if (image.Width > WidthThreshold) image.Resize((uint)(image.Width * 0.7), image.Height);
        if (image.Height > HeightThreshold) image.Resize(image.Width, (uint)(image.Height * 0.7));
            
        // Conversion du format en WebP
        image.Format = MagickFormat.WebP;
            
        var outputStream = new MemoryStream();
        image.Write(outputStream);
        outputStream.Position = 0;
        return Task.FromResult<Stream>(outputStream);
    }

    private Task<Stream> ApplyImageParametersAsync(IFormFile file, ImageParameterDto parameterDto)
    {
        using var inputStream = file.OpenReadStream();
        using var image = new MagickImage();
        image.Read(inputStream);
        
        // Redimensionnement

        image.Resize(parameterDto.Width, parameterDto.Height);
        image.Crop(parameterDto.SquareX, parameterDto.SquareY);
        
        var outputStream = new MemoryStream();
        image.Write(outputStream);
        outputStream.Position = 0;
        return Task.FromResult<Stream>(outputStream);
    }
}