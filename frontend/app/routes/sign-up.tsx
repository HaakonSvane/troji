import { SignUp } from "@clerk/react-router";
import { AuthShell } from "@/components/AuthShell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
    return (
        <AuthShell prompt="create account" headline="Stake your name in the ledger.">
            <SignUp forceRedirectUrl="/register" appearance={clerkAppearance} />
        </AuthShell>
    );
}
