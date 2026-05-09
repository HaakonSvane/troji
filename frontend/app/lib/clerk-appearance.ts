import type { ComponentProps } from "react";
import { SignIn } from "@clerk/react-router";

type Appearance = NonNullable<ComponentProps<typeof SignIn>["appearance"]>;

/**
 * Shared appearance object for Clerk's <SignIn> and <SignUp> widgets.
 * Mirrors troji's design tokens so the embedded forms feel native.
 *
 * Keep colors as resolved values (not CSS variables) — Clerk's renderer reads
 * them at render time and a `var(--foo)` reference would resolve against
 * Clerk's own iframe context, not ours.
 */
export const clerkAppearance: Appearance = {
    variables: {
        colorBackground: "oklch(0.18 0.007 75)",
        colorPrimary: "oklch(0.78 0.14 84)",
        colorText: "oklch(0.97 0.005 75)",
        colorTextSecondary: "oklch(0.62 0.01 75)",
        colorInputBackground: "oklch(0.16 0.006 75)",
        colorInputText: "oklch(0.97 0.005 75)",
        colorDanger: "oklch(0.704 0.191 22.216)",
        colorSuccess: "oklch(0.66 0.11 154)",
        colorWarning: "oklch(0.72 0.13 84)",
        colorNeutral: "oklch(0.62 0.01 75)",
        borderRadius: "0.375rem",
        fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
        fontFamilyButtons: '"Geist Mono", ui-monospace, monospace',
        fontSize: "0.875rem",
    },
    elements: {
        rootBox: "w-full",
        card: "bg-popover border border-border shadow-none rounded-md w-full",
        headerTitle:
            "font-heading text-2xl italic font-medium tracking-[0.025em] text-foreground",
        headerSubtitle: "text-sm text-muted-foreground",
        formButtonPrimary:
            "bg-medal-gold/8 border border-medal-gold/70 text-medal-gold hover:bg-medal-gold/14 hover:border-medal-gold rounded-sm font-mono uppercase tracking-[0.18em] text-[12px] normal-case shadow-none",
        socialButtonsBlockButton:
            "border border-border rounded-sm bg-surface hover:bg-surface-muted shadow-none",
        socialButtonsBlockButtonText:
            "font-mono uppercase tracking-[0.18em] text-[12px] text-foreground",
        dividerLine: "bg-border",
        dividerText:
            "text-muted-foreground font-mono uppercase tracking-[0.22em] text-[10px]",
        formFieldLabel:
            "font-mono uppercase tracking-[0.18em] text-[10px] text-muted-foreground",
        formFieldInput:
            "bg-input border border-border rounded-md text-foreground focus:border-medal-gold focus:ring-2 focus:ring-medal-gold/30",
        formFieldErrorText: "text-destructive text-xs",
        identityPreviewText: "text-foreground",
        identityPreviewEditButton: "text-medal-gold hover:text-medal-gold/80",
        footerAction: "bg-transparent",
        footerActionText: "text-muted-foreground text-xs",
        footerActionLink:
            "text-medal-gold hover:text-medal-gold/80 font-mono uppercase tracking-[0.18em] text-[11px]",
        otpCodeFieldInput:
            "bg-input border border-border rounded-md text-foreground focus:border-medal-gold",
        formResendCodeLink: "text-medal-gold hover:text-medal-gold/80",
        alertText: "text-destructive",
        alert: "bg-destructive/10 border border-destructive/40 rounded-md",
    },
};
