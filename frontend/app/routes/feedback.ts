import { getAuth, clerkClient } from "@clerk/react-router/server";
import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { dispatchFeedback } from "@/lib/server/github-dispatch";
import { checkRateLimit, buildUpdatedSubmissions } from "@/lib/server/feedback-rate-limit";
import { validateFeedbackInput } from "@/lib/validation/forms";

// Sanitise user input before it reaches the GitHub issue body.
// Inserts a zero-width space after @ to prevent unwanted GitHub mentions.
function sanitiseForGitHub(value: string, maxLen: number): string {
    return value
        .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "") // strip control chars except \t\n\r
        .replace(/(^|\s)@/g, "$1@\u200b") // neutralise @mentions
        .slice(0, maxLen);
}

function countUrls(text: string): number {
    return (text.match(/https?:\/\//gi) ?? []).length;
}

export async function action(args: ActionFunctionArgs) {
    const { userId } = await getAuth(args);
    if (!userId) {
        throw data({ ok: false, message: "Not authenticated." }, { status: 401 });
    }

    const formData = await args.request.formData();
    const title = String(formData.get("title") ?? "");
    const body = String(formData.get("body") ?? "");

    const validation = validateFeedbackInput({ title, body });
    if (!validation.success) {
        return { ok: false as const, message: validation.error };
    }

    if (countUrls(validation.data.body) > 5) {
        return { ok: false as const, message: "Feedback contains too many URLs." };
    }

    const client = clerkClient(args);
    const user = await client.users.getUser(userId);

    const rateLimitResult = checkRateLimit(user);
    if (!rateLimitResult.allowed) {
        return {
            ok: false as const,
            message: `Too many submissions. Try again in ${rateLimitResult.secondsUntilNext}s.`,
        };
    }

    try {
        await dispatchFeedback({
            title: sanitiseForGitHub(validation.data.title, 120),
            body: sanitiseForGitHub(validation.data.body, 4000),
            userId,
        });
    } catch (err) {
        console.error("feedback dispatch failed", err);
        return { ok: false as const, message: "Could not submit feedback. Please try again." };
    }

    // Metadata write is non-fatal: the feedback already shipped to GitHub, so a
    // failure here must not erase the success on the client.
    try {
        const updatedSubmissions = buildUpdatedSubmissions(user);
        await client.users.updateUserMetadata(userId, {
            privateMetadata: {
                ...(user.privateMetadata ?? {}),
                feedback: { submissions: updatedSubmissions },
            },
        });
    } catch (err) {
        console.error("feedback metadata update failed", err);
    }

    return { ok: true as const };
}
