import { SignIn } from "@clerk/react-router";

export default function SignInPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <SignIn forceRedirectUrl="/dashboard" />
        </div>
    );
}
