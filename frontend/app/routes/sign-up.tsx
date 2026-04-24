import { SignUp } from "@clerk/react-router";

export default function SignUpPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <SignUp forceRedirectUrl="/register" />
        </div>
    );
}
