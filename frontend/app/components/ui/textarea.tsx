import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "flex field-sizing-content min-h-16 w-full rounded-md border border-border bg-input px-3 py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-medal-gold focus-visible:ring-2 focus-visible:ring-medal-gold/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 md:text-sm",
                className
            )}
            {...props}
        />
    );
}

export { Textarea };
