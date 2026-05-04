import type { User } from "@clerk/backend";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const LIMIT_24H = 3;
const LIMIT_7D = 10;
const MAX_STORED = 10;

interface FeedbackMeta {
    submissions: number[];
}

function getFeedbackMeta(user: User): FeedbackMeta {
    const raw = (user.privateMetadata as Record<string, unknown>)?.feedback;
    if (raw && typeof raw === "object" && Array.isArray((raw as FeedbackMeta).submissions)) {
        return raw as FeedbackMeta;
    }
    return { submissions: [] };
}

export interface RateLimitResult {
    allowed: boolean;
    secondsUntilNext?: number;
}

export function checkRateLimit(user: User): RateLimitResult {
    const now = Date.now();
    const { submissions } = getFeedbackMeta(user);
    // Timestamps are stored ascending; filter to the rolling windows.
    const inWeek = submissions.filter((t) => t > now - WEEK_MS);
    const in24h = inWeek.filter((t) => t > now - DAY_MS);

    if (in24h.length >= LIMIT_24H) {
        const oldest = in24h[0];
        return {
            allowed: false,
            secondsUntilNext: Math.ceil((oldest + DAY_MS - now) / 1000),
        };
    }

    if (inWeek.length >= LIMIT_7D) {
        const oldest = inWeek[0];
        return {
            allowed: false,
            secondsUntilNext: Math.ceil((oldest + WEEK_MS - now) / 1000),
        };
    }

    return { allowed: true };
}

export function buildUpdatedSubmissions(user: User): number[] {
    const now = Date.now();
    const { submissions } = getFeedbackMeta(user);
    return submissions
        .filter((t) => t > now - WEEK_MS)
        .concat(now)
        .slice(-MAX_STORED);
}
