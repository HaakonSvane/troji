namespace api.API.Errors;

public sealed class DuplicateGameEmojiException : Exception
{
    public DuplicateGameEmojiException()
        : base("A game with this emoji already exists in the group.")
    {
    }
}
