import { Link } from "react-router";
import {
    Breadcrumb as BreadcrumbRoot,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface BreadcrumbSegment {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    segments: BreadcrumbSegment[];
    className?: string;
}

/**
 * Troji-styled breadcrumb. The last segment is the current page (no link);
 * earlier segments link to their `href`. The leading `$` glyph is a presentational
 * marker — it sits outside the semantic list.
 */
export function Breadcrumb({ segments, className }: BreadcrumbProps) {
    if (segments.length === 0) return null;

    return (
        <BreadcrumbRoot
            className={cn(
                "font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground",
                className
            )}
        >
            <BreadcrumbList className="gap-0 text-[11px] tracking-[0.28em] text-muted-foreground">
                <li aria-hidden className="inline-flex items-center text-medal-gold">
                    $
                </li>
                {segments.map((segment, idx) => {
                    const isLast = idx === segments.length - 1;
                    return (
                        <span key={`${segment.label}-${idx}`} className="contents">
                            <BreadcrumbItem
                                className={cn(
                                    idx === 0 && "ml-2",
                                    isLast && "text-foreground/85"
                                )}
                            >
                                {isLast || !segment.href ? (
                                    <BreadcrumbPage className="font-mono uppercase tracking-[0.28em] text-foreground/85">
                                        {segment.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={segment.href}>{segment.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast ? (
                                <BreadcrumbSeparator className="mx-2 text-border [&>svg]:hidden">
                                    /
                                </BreadcrumbSeparator>
                            ) : null}
                        </span>
                    );
                })}
            </BreadcrumbList>
        </BreadcrumbRoot>
    );
}
