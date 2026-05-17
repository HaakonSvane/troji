using System.Security.Claims;
using api.API.Errors;
using api.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace api.Images;

public static class ImageEndpoints
{
    public static void MapImageEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/images");

        group.MapGet("/{kind}/{imageId}/{size:int}", ServeImage)
            .AllowAnonymous();

        group.MapPost("/avatar", UploadAvatar)
            .RequireAuthorization()
            .DisableAntiforgery();

        group.MapPost("/group/{groupId:int}", UploadGroupImage)
            .RequireAuthorization()
            .DisableAntiforgery();
    }

    private static IResult ServeImage(
        string kind,
        string imageId,
        int size,
        [FromQuery] long exp,
        [FromQuery] string sig,
        IImageService images,
        HttpContext context)
    {
        if (!images.IsValidKind(kind) || !images.IsValidSize(size))
        {
            return Results.NotFound();
        }
        if (!images.VerifySignature(kind, imageId, size, exp, sig))
        {
            return Results.StatusCode(StatusCodes.Status403Forbidden);
        }

        var opened = images.Open(kind, imageId, size);
        if (opened is null)
        {
            return Results.NotFound();
        }

        var remaining = Math.Max(0, exp - DateTimeOffset.UtcNow.ToUnixTimeSeconds());
        context.Response.Headers.CacheControl = $"private, max-age={remaining}";
        return Results.Stream(opened.Value.Stream, opened.Value.ContentType);
    }

    private static async Task<IResult> UploadAvatar(
        IFormFile file,
        IImageService images,
        TrophyDbContext db,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
        {
            return Results.Unauthorized();
        }

        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user is null)
        {
            return Results.Json(new { code = "NoUserError" }, statusCode: StatusCodes.Status404NotFound);
        }

        string newImageId;
        try
        {
            await using var stream = file.OpenReadStream();
            newImageId = await images.SaveAsync("users", stream, cancellationToken);
        }
        catch (InvalidImageException ex)
        {
            return Results.BadRequest(new { code = "InvalidImageError", message = ex.Message });
        }

        var oldImageId = user.ImageId;
        user.ImageId = newImageId;
        await db.SaveChangesAsync(cancellationToken);

        if (!string.IsNullOrEmpty(oldImageId))
        {
            await images.DeleteAsync("users", oldImageId, cancellationToken);
        }

        return Results.Ok(new { imageId = newImageId });
    }

    private static async Task<IResult> UploadGroupImage(
        int groupId,
        IFormFile file,
        IImageService images,
        TrophyDbContext db,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
        {
            return Results.Unauthorized();
        }

        var group = await db.Groups.FirstOrDefaultAsync(g => g.Id == groupId, cancellationToken);
        if (group is null)
        {
            return Results.Json(new { code = "GroupNotFoundError" }, statusCode: StatusCodes.Status404NotFound);
        }
        if (group.AdminId != userId)
        {
            return Results.Json(new { code = "NoAdminError" }, statusCode: StatusCodes.Status403Forbidden);
        }

        string newImageId;
        try
        {
            await using var stream = file.OpenReadStream();
            newImageId = await images.SaveAsync("groups", stream, cancellationToken);
        }
        catch (InvalidImageException ex)
        {
            return Results.BadRequest(new { code = "InvalidImageError", message = ex.Message });
        }

        var oldImageId = group.ImageId;
        group.ImageId = newImageId;
        await db.SaveChangesAsync(cancellationToken);

        if (!string.IsNullOrEmpty(oldImageId))
        {
            await images.DeleteAsync("groups", oldImageId, cancellationToken);
        }

        return Results.Ok(new { imageId = newImageId });
    }
}
