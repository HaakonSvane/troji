import { MidScreenContent } from "@/components/containers/MidScreenContent";
import { SectionHeader } from "../labels/SectionHeader";
import { useMemo } from "react";

type FatalErrorProps = {
    error?: unknown;
};

export const FatalError = ({ error }: FatalErrorProps) => {
    const niceError = useMemo(() => {
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === "string") {
            return error;
        }
        try {
            return JSON.stringify(error);
        } catch {
            return "Unknown error";
        }
    }, [error]);
    return (
        <MidScreenContent>
            <div className="grid gap-8">
                <div>
                    <SectionHeader title="fatal application error :(" />
                    <p>Whoops! It seems the application has met with a terrible fate</p>
                    <p>Contact a grown up if the problem persists</p>
                </div>
                {!!error && (
                    <div>
                        <code>{niceError}</code>
                    </div>
                )}
            </div>
        </MidScreenContent>
    );
};
