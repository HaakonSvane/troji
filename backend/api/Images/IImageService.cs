namespace api.Images;

public interface IImageService
{
    Task<string> SaveAsync(string kind, Stream source, CancellationToken cancellationToken);

    Task DeleteAsync(string kind, string imageId, CancellationToken cancellationToken);

    string SignUrl(string kind, string imageId, int size, DateTimeOffset expiry);

    string SignFreshUrl(string kind, string imageId, int size);

    bool VerifySignature(string kind, string imageId, int size, long expUnix, string sigB64);

    (Stream Stream, string ContentType)? Open(string kind, string imageId, int size);

    bool IsValidSize(int size);

    bool IsValidKind(string kind);
}
