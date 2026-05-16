using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using api.API.Errors;
using Microsoft.Extensions.Options;
using SkiaSharp;
using Path = System.IO.Path;

namespace api.Images;

public sealed partial class ImageService : IImageService
{
    private static readonly string[] AllowedKinds = ["users", "groups"];
    private static readonly Regex ImageIdPattern = ImageIdRegex();

    private readonly ImageOptions _options;
    private readonly byte[] _signingKeyBytes;

    public ImageService(IOptions<ImageOptions> options)
    {
        _options = options.Value;
        _signingKeyBytes = string.IsNullOrEmpty(_options.UrlSigningKey)
            ? []
            : Encoding.UTF8.GetBytes(_options.UrlSigningKey);
    }

    public bool IsValidKind(string kind) => AllowedKinds.Contains(kind);

    public bool IsValidSize(int size) => _options.Sizes.Contains(size);

    public async Task<string> SaveAsync(string kind, Stream source, CancellationToken cancellationToken)
    {
        if (!IsValidKind(kind))
        {
            throw new InvalidImageException("Unknown image kind.");
        }

        await using var buffered = new MemoryStream();
        var copyBuffer = new byte[81920];
        long total = 0;
        int read;
        while ((read = await source.ReadAsync(copyBuffer, cancellationToken)) > 0)
        {
            total += read;
            if (total > _options.MaxBytes)
            {
                throw new InvalidImageException($"Image exceeds the {_options.MaxBytes}-byte limit.");
            }
            await buffered.WriteAsync(copyBuffer.AsMemory(0, read), cancellationToken);
        }
        buffered.Position = 0;

        using var data = SKData.Create(buffered);
        using var codec = SKCodec.Create(data);
        if (codec is null)
        {
            throw new InvalidImageException("Unsupported or corrupt image.");
        }

        var info = codec.Info;
        if ((long)info.Width * info.Height > _options.MaxSourcePixels)
        {
            throw new InvalidImageException("Image dimensions exceed the safety limit.");
        }

        using var sourceBitmap = SKBitmap.Decode(codec);
        if (sourceBitmap is null)
        {
            throw new InvalidImageException("Failed to decode image.");
        }

        var imageId = Guid.CreateVersion7().ToString("N");
        var entryDir = ResolveDirectory(kind, imageId);
        Directory.CreateDirectory(entryDir);

        var side = Math.Min(sourceBitmap.Width, sourceBitmap.Height);
        var cropX = (sourceBitmap.Width - side) / 2;
        var cropY = (sourceBitmap.Height - side) / 2;
        var sourceRect = SKRect.Create(cropX, cropY, side, side);

        var sampling = new SKSamplingOptions(SKFilterMode.Linear, SKMipmapMode.Linear);

        foreach (var size in _options.Sizes)
        {
            using var target = new SKBitmap(new SKImageInfo(size, size, SKColorType.Rgba8888, SKAlphaType.Premul));
            using (var canvas = new SKCanvas(target))
            {
                canvas.Clear(SKColors.Transparent);
                var destRect = SKRect.Create(0, 0, size, size);
                using var sourceImage = SKImage.FromBitmap(sourceBitmap);
                canvas.DrawImage(sourceImage, sourceRect, destRect, sampling, paint: null);
            }

            using var image = SKImage.FromBitmap(target);
            using var encoded = image.Encode(SKEncodedImageFormat.Webp, 85);

            var finalPath = Path.Combine(entryDir, $"{size}.webp");
            var tempPath = finalPath + ".tmp";

            await using (var fileStream = File.Create(tempPath))
            {
                encoded.SaveTo(fileStream);
                await fileStream.FlushAsync(cancellationToken);
            }
            File.Move(tempPath, finalPath, overwrite: true);
        }

        return imageId;
    }

    public Task DeleteAsync(string kind, string imageId, CancellationToken cancellationToken)
    {
        if (!IsValidKind(kind) || !ImageIdPattern.IsMatch(imageId))
        {
            return Task.CompletedTask;
        }

        var dir = ResolveDirectory(kind, imageId);
        foreach (var size in _options.Sizes)
        {
            var path = Path.Combine(dir, $"{size}.webp");
            try
            {
                File.Delete(path);
            }
            catch (FileNotFoundException) { }
            catch (DirectoryNotFoundException) { }
        }

        return Task.CompletedTask;
    }

    public string SignUrl(string kind, string imageId, int size, DateTimeOffset expiry)
    {
        var expUnix = expiry.ToUnixTimeSeconds();
        var sig = ComputeSignature(kind, imageId, size, expUnix);
        return $"/api/images/{kind}/{imageId}/{size}?exp={expUnix}&sig={UrlEncodeBase64(sig)}";
    }

    public string SignFreshUrl(string kind, string imageId, int size)
    {
        return SignUrl(kind, imageId, size, DateTimeOffset.UtcNow.AddSeconds(_options.UrlTtlSeconds));
    }

    public bool VerifySignature(string kind, string imageId, int size, long expUnix, string sigB64)
    {
        if (_signingKeyBytes.Length == 0)
        {
            return false;
        }
        // FromUnixTimeSeconds throws on out-of-range input; reject anything outside
        // [unix epoch, year 9999] up front so a malformed `exp` returns 403 rather
        // than crashing the request pipeline.
        if (expUnix < 0 || expUnix > 253402300799)
        {
            return false;
        }
        if (DateTimeOffset.FromUnixTimeSeconds(expUnix) < DateTimeOffset.UtcNow)
        {
            return false;
        }
        byte[] provided;
        try
        {
            provided = UrlDecodeBase64(sigB64);
        }
        catch (FormatException)
        {
            return false;
        }
        var expected = ComputeSignature(kind, imageId, size, expUnix);
        return CryptographicOperations.FixedTimeEquals(provided, expected);
    }

    public (Stream Stream, string ContentType)? Open(string kind, string imageId, int size)
    {
        if (!IsValidKind(kind) || !IsValidSize(size) || !ImageIdPattern.IsMatch(imageId))
        {
            return null;
        }
        var path = Path.Combine(ResolveDirectory(kind, imageId), $"{size}.webp");
        if (!File.Exists(path))
        {
            return null;
        }
        return (File.OpenRead(path), "image/webp");
    }

    private string ResolveDirectory(string kind, string imageId)
    {
        if (!ImageIdPattern.IsMatch(imageId))
        {
            throw new InvalidImageException("Invalid image id.");
        }

        var storageRoot = Path.GetFullPath(_options.StoragePath);
        var prefix = imageId[..2];
        var rest = imageId[2..];
        var dir = Path.GetFullPath(Path.Combine(storageRoot, kind, prefix, rest));

        if (!dir.StartsWith(storageRoot, StringComparison.Ordinal))
        {
            throw new InvalidImageException("Resolved path escapes storage root.");
        }
        return dir;
    }

    private byte[] ComputeSignature(string kind, string imageId, int size, long expUnix)
    {
        var payload = Encoding.UTF8.GetBytes($"{kind}|{imageId}|{size}|{expUnix}");
        return HMACSHA256.HashData(_signingKeyBytes, payload);
    }

    private static string UrlEncodeBase64(byte[] bytes)
    {
        return Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    private static byte[] UrlDecodeBase64(string value)
    {
        var normalized = value.Replace('-', '+').Replace('_', '/');
        switch (normalized.Length % 4)
        {
            case 2: normalized += "=="; break;
            case 3: normalized += "="; break;
        }
        return Convert.FromBase64String(normalized);
    }

    [GeneratedRegex("^[0-9a-f]{32}$", RegexOptions.Compiled)]
    private static partial Regex ImageIdRegex();
}
