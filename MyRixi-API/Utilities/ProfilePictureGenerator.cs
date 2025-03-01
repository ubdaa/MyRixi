using MyRixiApi.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace MyRixiApi.Utilities;

public static class ProfilePictureGenerator
{
    public static async Task<string> GenerateRandomProfilePictureAsync(IStorageService storageService, Guid userId)
    {
        // Dimensions originales et finales
        const int originalSize = 8;
        const int finalSize = 256;
        
        // Générer des couleurs aléatoires avec un bon contraste
        var random = new Random(Environment.TickCount);
        var backgroundColor = GetRandomColor(random);
        var foregroundColor = GetContrastingColor(backgroundColor);
            
        // Créer une matrice pour générer un motif symétrique
        var pattern = random.NextDouble() < 0.9 ? GenerateSymmetricalPattern(random, originalSize) :
            GenerateRandomPattern(random, originalSize);
            
        // Créer l'image
        using var image = new Image<Rgba32>(originalSize, originalSize);
            
        // Remplir avec les couleurs appropriées selon le motif
        for (int y = 0; y < originalSize; y++)
        {
            for (int x = 0; x < originalSize; x++)
            {
                // Les bords sont toujours de la couleur de fond
                if (x == 0 || y == 0 || x == originalSize - 1 || y == originalSize - 1)
                {
                    image[x, y] = backgroundColor;
                }
                else
                {
                    // À l'intérieur, utiliser le motif pour déterminer la couleur
                    image[x, y] = pattern[x, y] ? foregroundColor : backgroundColor;
                }
            }
        }
            
        // Redimensionner l'image (upsize)
        image.Mutate(x => x.Resize(finalSize, finalSize, KnownResamplers.NearestNeighbor));
            
        // Convertir l'image en stream pour l'upload
        using var memoryStream = new MemoryStream();
        await image.SaveAsWebpAsync(memoryStream);
        memoryStream.Position = 0;
            
        // Uploader l'image via le service de stockage
        string fileName = $"{userId}_profile.webp";
        string contentType = "image/webp";
        string fileUrl = await storageService.UploadFileAsync(memoryStream, "profile", fileName, contentType);
            
        return fileUrl;
    }
        
    private static Rgba32 GetRandomColor(Random random)
    {
        return new Rgba32(
            (byte)random.Next(256),
            (byte)random.Next(256),
            (byte)random.Next(256),
            255);
    }
        
    private static Rgba32 GetContrastingColor(Rgba32 color)
    {
        // Calculer la luminance (simplifiée)
        double luminance = 0.299 * color.R + 0.587 * color.G + 0.114 * color.B;
            
        // Si la couleur est claire, retourner une couleur foncée, et vice versa
        if (luminance > 128)
        {
            return new Rgba32(
                (byte)Math.Max(0, color.R - 128),
                (byte)Math.Max(0, color.G - 128),
                (byte)Math.Max(0, color.B - 128),
                255);
        }
        else
        {
            return new Rgba32(
                (byte)Math.Min(255, color.R + 128),
                (byte)Math.Min(255, color.G + 128),
                (byte)Math.Min(255, color.B + 128),
                255);
        }
    }
        
    private static bool[,] GenerateSymmetricalPattern(Random random, int size)
    {
        var pattern = new bool[size, size];
            
        // Générer la moitié gauche du pattern (sans les bords)
        for (int y = 1; y < size - 1; y++)
        {
            for (int x = 1; x <= size / 2; x++)
            {
                // 70% de chance d'avoir un pixel de couleur principale
                pattern[x, y] = random.NextDouble() < 0.7;
            }
        }
            
        // Refléter la moitié gauche vers la droite pour créer une symétrie
        for (int y = 1; y < size - 1; y++)
        {
            for (int x = 1; x <= size / 2; x++)
            {
                pattern[size - 1 - x, y] = pattern[x, y];
            }
        }
            
        return pattern;
    }
    
    private static bool[,] GenerateRandomPattern(Random random, int size)
    {
        var pattern = new bool[size, size];
        
        for (int y = 0; y < size; y++)
        {
            for (int x = 0; x < size; x++)
            {
                pattern[x, y] = random.NextDouble() < 0.5;
            }
        }
        
        return pattern;
    }
}