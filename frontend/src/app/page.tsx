import { MidScreenContent } from "@/components/containers/MidScreenContent";
import { SectionHeader } from "@/components/labels/SectionHeader";
import { Button } from "@/components/ui/button";

const LandingPage = async () => {
    return (
        <MidScreenContent className="justify-center">
            <SectionHeader title="TROJI.ME" />
            <div className="flex flex-col gap-8">
                <p>
                    {
                        "Welcome to Troji.me! This is a website where you can track your wins and losses in games and compete with your friends."
                    }
                </p>
                <p>{"To begin, please sign in. It's free!"}</p>
                <Button asChild>
                    <a href={"/api/auth/login"}>Sign in</a>
                </Button>
            </div>
        </MidScreenContent>
    );
};

export default LandingPage;
