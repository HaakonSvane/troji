import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import emojilib from "emojilib";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// emojilib exports { "😀": ["grinning", ...], ... }
const ALL_EMOJIS: Array<{ emoji: string; keywords: string[] }> = Object.entries(
    emojilib as Record<string, string[]>
).map(([emoji, keywords]) => ({ emoji, keywords }));

const GRID_COLUMNS = 8;
const CELL_SIZE = 36;

interface EmojiPickerProps {
    value: string;
    onChange: (emoji: string) => void;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
}

const sizeConfig = {
    sm: { button: "h-10 w-14 text-xl", textSize: "text-xl" },
    md: { button: "h-12 w-16 text-2xl", textSize: "text-2xl" },
    lg: { button: "h-32 w-32 text-5xl", textSize: "text-5xl" },
} as const;

export function EmojiPicker({ value, onChange, disabled = false, size = "md" }: EmojiPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const parentRef = useRef<HTMLDivElement>(null);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return ALL_EMOJIS;
        return ALL_EMOJIS.filter((e) => e.keywords.some((k) => k.includes(q)));
    }, [search]);

    // Group into rows for the virtualizer
    const rows = useMemo(() => {
        const result: Array<typeof filtered> = [];
        for (let i = 0; i < filtered.length; i += GRID_COLUMNS) {
            result.push(filtered.slice(i, i + GRID_COLUMNS));
        }
        return result;
    }, [filtered]);

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => CELL_SIZE,
        overscan: 5,
    });

    // Force virtualizer to measure when filtered content changes
    useEffect(() => {
        rowVirtualizer.measure();
    }, [filtered, rowVirtualizer]);

    const handleSelect = useCallback(
        (emoji: string) => {
            onChange(emoji);
            setOpen(false);
            setSearch("");
        },
        [onChange]
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={`flex items-center justify-center rounded-md border border-input bg-background shadow-sm transition-colors hover:bg-accent disabled:opacity-50 ${sizeConfig[size].button}`}
                    aria-label="Pick emoji"
                >
                    {value || "🏆"}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2" align="start">
                <Input
                    placeholder="Search emoji…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2 h-8 text-sm"
                    autoFocus
                />
                <div ref={parentRef} style={{ height: `${CELL_SIZE * 6}px`, overflow: "auto" }}>
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            position: "relative",
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                            <div
                                key={virtualRow.index}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    transform: `translateY(${virtualRow.start}px)`,
                                    width: "100%",
                                    display: "flex",
                                }}
                            >
                                {rows[virtualRow.index].map(({ emoji }) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleSelect(emoji)}
                                        className="flex items-center justify-center rounded text-xl transition-colors hover:bg-accent"
                                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                                        aria-label={emoji}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                    {filtered.length === 0 && (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No emoji found.
                        </p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
