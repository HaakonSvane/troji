interface ProfileLike {
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
}

export function formatFullName(profile: ProfileLike, fallback = "Unknown"): string {
    return (
        [profile.firstName, profile.middleName, profile.lastName]
            .filter(Boolean)
            .join(" ") || fallback
    );
}

export function initialsFromDisplayName(displayName: string | null | undefined): string {
    if (!displayName) return "?";
    const trimmed = displayName.trim();
    if (trimmed.length === 0) return "?";

    const tokens = trimmed.split(/\s+/);
    if (tokens.length >= 2) {
        const first = Array.from(tokens[0])[0] ?? "";
        const last = Array.from(tokens[tokens.length - 1])[0] ?? "";
        return (first + last).toUpperCase();
    }

    const chars = Array.from(trimmed);
    return ((chars[0] ?? "") + (chars[1] ?? "")).toUpperCase();
}
