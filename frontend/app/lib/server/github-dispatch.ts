export interface FeedbackPayload {
    title: string;
    name: string;
    email: string;
    body: string;
    userId: string;
}

export async function dispatchFeedback(payload: FeedbackPayload): Promise<void> {
    const token = process.env.GITHUB_FEEDBACK_TOKEN;
    const repo = process.env.GITHUB_FEEDBACK_REPO;

    if (!token || !repo) {
        throw new Error(
            "GitHub feedback credentials are not configured (GITHUB_FEEDBACK_TOKEN / GITHUB_FEEDBACK_REPO)."
        );
    }

    const response = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
            event_type: "submit_feedback",
            client_payload: payload,
        }),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`GitHub dispatch failed: ${response.status} ${text.slice(0, 200)}`);
    }
}
