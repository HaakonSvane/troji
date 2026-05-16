type TokenGetter = () => Promise<string | null>;

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 8 * 1024 * 1024;

export class UploadImageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UploadImageError";
    }
}

function apiBaseUrl(): string {
    const graphql = import.meta.env.VITE_GRAPHQL_URL as string;
    return graphql.replace(/\/graphql\/?$/, "");
}

function validate(file: File): void {
    if (!ALLOWED_MIME.includes(file.type)) {
        throw new UploadImageError("Image must be PNG, JPEG, or WebP.");
    }
    if (file.size > MAX_BYTES) {
        throw new UploadImageError("Image is larger than 8 MB.");
    }
}

async function postFile(
    path: string,
    file: File,
    getToken: TokenGetter
): Promise<{ imageId: string }> {
    const token = await getToken();
    const form = new FormData();
    form.append("file", file, file.name);
    const response = await fetch(`${apiBaseUrl()}${path}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
    });
    if (!response.ok) {
        let message = "Upload failed.";
        try {
            const body = (await response.json()) as { message?: string };
            if (body.message) message = body.message;
        } catch {
            /* fall through */
        }
        throw new UploadImageError(message);
    }
    return (await response.json()) as { imageId: string };
}

export async function uploadAvatar(file: File, getToken: TokenGetter): Promise<{ imageId: string }> {
    validate(file);
    return postFile("/api/images/avatar", file, getToken);
}

export async function uploadGroupImage(
    groupId: string,
    file: File,
    getToken: TokenGetter
): Promise<{ imageId: string }> {
    validate(file);
    return postFile(`/api/images/group/${encodeURIComponent(groupId)}`, file, getToken);
}
