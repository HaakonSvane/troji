namespace api.Images;

public sealed class ImageOptions
{
    public const string SectionName = "Images";

    public string StoragePath { get; set; } = "./images";

    public long MaxBytes { get; set; } = 8 * 1024 * 1024;

    public int[] Sizes { get; set; } = [64, 128, 256];

    public int UrlTtlSeconds { get; set; } = 900;

    public long MaxSourcePixels { get; set; } = 100_000_000;

    public string UrlSigningKey { get; set; } = "";
}
