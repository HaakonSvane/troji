import { useCallback, useMemo, useState } from "react";
import emojilib from "emojilib";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// emojilib exports { "😀": ["grinning", ...], ... }
const ALL_EMOJIS: Array<{ emoji: string; keywords: string[] }> = Object.entries(
    emojilib as Record<string, string[]>
).map(([emoji, keywords]) => ({ emoji, keywords }));

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

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return ALL_EMOJIS;
        return ALL_EMOJIS.filter((e) => e.keywords.some((k) => k.includes(q)));
    }, [search]);

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
                <div
                    className="grid grid-cols-8 gap-0.5 overflow-auto"
                    style={{ maxHeight: `${CELL_SIZE * 6}px` }}
                >
                    {filtered.map(({ emoji }) => (
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
                    {filtered.length === 0 && (
                        <p className="col-span-8 py-4 text-center text-sm text-muted-foreground">
                            No emoji found.
                        </p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
