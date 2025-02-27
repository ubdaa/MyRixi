using ImageMagick.Formats;
using ImageMagick;

namespace MyRixiApi.Utilities;

public class ProfilePictureGenerator
{
    private static readonly Random Random = new();

    public static async Task<Stream> GenerateProfilePictureAsync()
    {
        // Générer une couleur de fond aléatoire
        var backgroundColor = GetRandomColor();
        
        // Générer une couleur principale contrastante
        var mainColor = GetRandomColor();

        using var image = new MagickImage(backgroundColor, 8, 8);
        
        
        // seuil de remplissage (entre 0 et 1)
        var fillThreshold = Random.NextDouble() * 0.5 + 0.25;
        
        for (int x = 1; x < 8; x++)
        {
            for (int y = 1; y < 8; y++)
            {
                if (Random.NextDouble() < fillThreshold) continue;
                
                image.GetPixels().SetPixel(x, y, new[] { mainColor.R, mainColor.G, mainColor.B });
            }
        }

        // Redimensionner à 256x256 avec un filtre adapté pour pixel art
        image.Scale(256, 256);

        // Convertir en WebP
        var webpSettings = new WebPWriteDefines
        {
            Method = 6, // Compression efficace
            Lossless = true
        };
        image.Format = MagickFormat.WebP;
        image.Settings.SetDefines(webpSettings);

        // Sauvegarde dans un stream
        var outputStream = new MemoryStream();
        await image.WriteAsync(outputStream);
        outputStream.Position = 0;

        return outputStream;
    }

    private static MagickColor GetRandomColor()
    {
        byte r = (byte)Random.Next(256);
        byte g = (byte)Random.Next(256);
        byte b = (byte)Random.Next(256);
        return new MagickColor(r, g, b);
    }

    private static MagickColor GetContrastingColor(MagickColor bgColor)
    {
        // Convertir en valeurs de luminance
        double luminance = (0.299 * bgColor.R + 0.587 * bgColor.G + 0.114 * bgColor.B) / 255.0;
        return luminance > 0.5 ? new MagickColor(0, 0, 0) : new MagickColor(255, 255, 255);
    }
}
