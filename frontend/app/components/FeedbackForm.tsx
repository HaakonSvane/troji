import { useEffect } from "react";
import { useFetcher } from "react-router";
import type { action } from "@/routes/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DrawerDialog } from "@/components/DrawerDialog";

interface FeedbackFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FeedbackForm({ open, onOpenChange }: FeedbackFormProps) {
    const fetcher = useFetcher<typeof action>();
    const isSubmitting = fetcher.state === "submitting";
    const result = fetcher.data;

    useEffect(() => {
        if (result?.ok === true) {
            onOpenChange(false);
        }
    }, [result, onOpenChange]);

    return (
        <DrawerDialog
            open={open}
            onOpenChange={(next) => {
                if (!isSubmitting) onOpenChange(next);
            }}
            title="Send feedback"
            description="Share your thoughts, report a bug, or suggest a feature."
        >
            <fetcher.Form method="post" action="/feedback" className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="feedback-title">Title</Label>
                    <Input
                        id="feedback-title"
                        name="title"
                        placeholder="Brief summary of your feedback"
                        disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="feedback-body">Details</Label>
                    <Textarea
                        id="feedback-body"
                        name="body"
                        placeholder="Describe your feedback in detail..."
                        rows={5}
                        disabled={isSubmitting}
                    />
                </div>
                {result?.ok === false && (
                    <p className="text-sm text-destructive">{result.message}</p>
                )}
                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending…" : "Send feedback"}
                    </Button>
                </div>
            </fetcher.Form>
        </DrawerDialog>
    );
}
