using Minio;
using Minio.DataModel.Args;
using MyRixiApi.Interfaces;

namespace MyRixiApi.Services;


public class MinioStorageService : IStorageService
{
    private readonly IMinioClient _minioClient;
    private readonly string _bucketName;
    
    public MinioStorageService(IConfiguration configuration)
    {
        _minioClient = new MinioClient()
            .WithEndpoint(configuration["Minio:Endpoint"])
            .WithCredentials(
                configuration["Minio:AccessKey"],
                configuration["Minio:SecretKey"]
            )
            .WithSSL(false) // Selon votre configuration
            .Build();
        
        _bucketName = configuration["Minio:BucketName"];
    }
    
    public async Task<string> UploadFileAsync(IFormFile file, string prefix)
    {
        // Génère un nom unique pour le fichier
        var fileName = $"{prefix}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        
        // Prépare les métadonnées
        var metaData = new Dictionary<string, string>
        {
            { "Content-Type", file.ContentType }
        };
        
        // Vérifie si le bucket existe, le crée si nécessaire
        bool found = await _minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName));
        if (!found)
        {
            await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucketName));
        }
        
        // Upload le fichier
        using (var stream = file.OpenReadStream())
        {
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(fileName)
                .WithStreamData(stream)
                .WithObjectSize(file.Length)
                .WithContentType(file.ContentType);
            
            await _minioClient.PutObjectAsync(putObjectArgs);
        }
        
        // Retourne l'URL du fichier
        return $"{_bucketName}/{fileName}";
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string prefix, string fileName, string contentType)
    {
        var bucketFileName = $"{prefix}/{Guid.NewGuid()}{Path.GetExtension(fileName)}";
        
        // Prépare les métadonnées
        var metaData = new Dictionary<string, string>
        {
            { "Content-Type", contentType }
        };
        
        // Vérifie si le bucket existe, le crée si nécessaire
        bool found = await _minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName));
        if (!found)
        {
            await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucketName));
        }
        
        // Upload le fichier
        using (var stream = fileStream)
        {
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(bucketFileName)
                .WithStreamData(stream)
                .WithObjectSize(stream.Length)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);
        }
        
        // Retourne l'URL du fichier
        return $"{_bucketName}/{bucketFileName}";
    }
    
    public async Task DeleteFileAsync(string fileUrl)
    {
        var fileName = fileUrl.Split('/').Last();
        await _minioClient.RemoveObjectAsync(
            new RemoveObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(fileName)
        );
    }
}