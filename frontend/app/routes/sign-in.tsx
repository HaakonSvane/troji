import { SignIn } from "@clerk/react-router";
import { AuthShell } from "@/components/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export function meta() {
    return [
        { title: "Sign In — Troji" },
        { name: "description", content: "Sign in to troji and get back in the game." },
    ];
}

export default function SignInPage() {
    return (
        <AuthShell prompt="sign in" headline="Welcome back, champion.">
            <SignIn forceRedirectUrl="/dashboard" appearance={clerkAppearance} />
        </AuthShell>
    );
}
