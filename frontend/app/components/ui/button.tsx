import * as React from "react";
import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/** Extend disabled with an optional reason that shows a hint on hover or tap. */
export type ButtonDisabledProp = boolean | { isDisabled: boolean; reason: string };

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
                outline:
                    "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
                ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
                destructive:
                    "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default:
                    "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
                xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
                sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
                lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
                icon: "size-8",
                "icon-xs":
                    "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
                "icon-sm":
                    "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
                "icon-lg": "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Button({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    children,
    leadingIcon,
    trailingIcon,
    busy = false,
    disabled,
    onClick,
    ...props
}: Omit<React.ComponentProps<"button">, "disabled"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        leadingIcon?: React.ReactNode;
        trailingIcon?: React.ReactNode;
        busy?: boolean;
        disabled?: ButtonDisabledProp;
    }) {
    const [hintOpen, setHintOpen] = useState(false);

    const isDisabledBool =
        typeof disabled === "boolean" ? disabled : (disabled?.isDisabled ?? false);
    const disabledReason = typeof disabled === "object" ? disabled.reason : undefined;
    const hasHint = isDisabledBool && !!disabledReason;
    const resolvedDisabled = isDisabledBool || busy;

    const Comp = asChild ? Slot.Root : "button";
    const startIcon = busy ? <ArrowPathIcon className="animate-spin" /> : leadingIcon;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (hasHint) {
            e.preventDefault();
            setHintOpen(true);
            return;
        }
        onClick?.(e);
    };

    const buttonEl = (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            aria-busy={busy || undefined}
            aria-disabled={hasHint ? true : undefined}
            disabled={asChild ? undefined : hasHint ? false : resolvedDisabled}
            className={cn(
                buttonVariants({ variant, size, className }),
                hasHint && "opacity-50 cursor-not-allowed active:translate-y-0"
            )}
            onClick={handleClick}
            {...props}
        >
            {startIcon ? (
                <span data-icon="inline-start" className="inline-flex items-center justify-center">
                    {startIcon}
                </span>
            ) : null}
            {children ? <span className="inline-flex items-center gap-1">{children}</span> : null}
            {!busy && trailingIcon ? (
                <span data-icon="inline-end" className="inline-flex items-center justify-center">
                    {trailingIcon}
                </span>
            ) : null}
        </Comp>
    );

    if (hasHint) {
        return (
            <TooltipProvider>
                <Tooltip open={hintOpen} onOpenChange={setHintOpen}>
                    <TooltipTrigger asChild>{buttonEl}</TooltipTrigger>
                    <TooltipContent>{disabledReason}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return buttonEl;
}

export { Button, buttonVariants };
