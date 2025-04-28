using Minio;
using Minio.DataModel.Args;
using MyRixiApi.Interfaces;

namespace MyRixiApi.Services;


public class MinioStorageService : IStorageService
{
    private readonly IMinioClient _minioClient;
    private readonly string _bucketName;
    
    private readonly string _storageUrl;
    
    public MinioStorageService(IConfiguration configuration)
    {
        string? endpoint = Environment.GetEnvironmentVariable("Minio__Endpoint") 
                           ?? configuration["Minio:Endpoint"];
        string? accessKey = Environment.GetEnvironmentVariable("Minio__AccessKey") 
                            ?? configuration["Minio:AccessKey"];
        string? secretKey = Environment.GetEnvironmentVariable("Minio__SecretKey") 
                            ?? configuration["Minio:SecretKey"];
        string? bucketName = Environment.GetEnvironmentVariable("Minio__BucketName") 
                             ?? configuration["Minio:BucketName"];

        _minioClient = new MinioClient()
            .WithEndpoint(endpoint)
            .WithCredentials(accessKey, secretKey)
            .WithSSL(false)
            .Build();
    
        _bucketName = bucketName!;
        _storageUrl = endpoint!;
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
        return $"https://{_storageUrl}/{_bucketName}/{fileName}";
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
        return $"https://{_storageUrl}/{_bucketName}/{bucketFileName}";
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