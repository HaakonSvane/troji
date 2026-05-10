import { SignUp } from "@clerk/react-router";
import { AuthShell } from "@/components/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export function meta() {
    return [
        { title: "Sign Up — Troji" },
        { name: "description", content: "Create an account and stake your name in the ledger." },
    ];
}

export default function SignUpPage() {
    return (
        <AuthShell prompt="create account" headline="Stake your name in the ledger.">
            <SignUp forceRedirectUrl="/register" appearance={clerkAppearance} />
        </AuthShell>
    );
}
