"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import emojiList from "emojilib";
import { useId, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandEmpty } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const NUM_COLUMNS = 4;
const BUTTON_SIZE = 60;

type EmojiPickerProps = {
    onSelect: (emoji?: string) => void;
    portal?: boolean;
};

export const EmojiPicker = ({ onSelect, portal = true }: EmojiPickerProps) => {
    const [searchText, setSearchText] = useState<string>();

    const [open, setOpen] = useState<boolean>(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string>();

    const onClickEmoji = (emoji?: string) => {
        console.log("selected:", emoji);
        setSelectedEmoji(emoji);
        onSelect(emoji);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        `w-[${selectedEmoji ? "80" : "200"}px] justify-between`,
                        !!selectedEmoji && "text-xl",
                    )}
                >
                    {selectedEmoji ?? "Select trophy"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={"p-0"} portal={portal}>
                <Command shouldFilter={false}>
                    <CommandInput
                        value={searchText}
                        onValueChange={setSearchText}
                        placeholder="Search emojis..."
                    />
                    <ScrollArea>
                        <EmojiList
                            searchText={searchText}
                            onClickEmoji={onClickEmoji}
                            emoji={selectedEmoji}
                        />
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
EmojiPicker.displayName = "EmojiPicker";

type EmojiListProps = {
    emoji?: string;
    searchText?: string;
    onClickEmoji: (emoji: string) => void;
};

const EmojiList = ({ searchText, onClickEmoji, emoji: selectedEmoji }: EmojiListProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const filteredEmojis = useMemo(() => {
        if (!searchText) return Object.keys(emojiList);
        const filteredData = Object.entries(emojiList).filter(([_, searchTerms]) =>
            searchTerms.some(term => term.startsWith(searchText.toLowerCase())),
        );
        return filteredData.map(data => data[0]);
    }, [searchText]);

    const rowVirtualizer = useVirtualizer({
        count: Math.ceil(filteredEmojis.length / NUM_COLUMNS),
        getScrollElement: () => scrollRef.current,
        estimateSize: () => BUTTON_SIZE,
    });

    return (
        <CommandGroup
            ref={scrollRef}
            style={{
                height: 300,
                width: "100%",
                overflow: "auto",
            }}
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                    display: "flex",
                    gap: 8,
                }}
            >
                {rowVirtualizer.getVirtualItems().map(item => (
                    <div
                        key={item.key}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: `${item.size}px`,
                            transform: `translateY(${item.start}px)`,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                height: "100%",
                                justifyContent: "center",
                                gap: 8,
                            }}
                        >
                            {[...Array(NUM_COLUMNS)].map((_, colIndex) => {
                                const emoji = filteredEmojis.at(
                                    item.index * NUM_COLUMNS + colIndex,
                                );
                                if (!emoji) return null;
                                return (
                                    <EmojiButton
                                        key={emoji}
                                        emoji={emoji}
                                        isSelected={selectedEmoji === emoji}
                                        onClick={() => onClickEmoji(emoji)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </CommandGroup>
    );
};

EmojiList.displayName = "EmojiList";

type EmojiButtonProps = {
    emoji: string;
    isSelected: boolean;
    onClick: () => void;
};

export const EmojiButton = ({ isSelected, onClick, emoji }: EmojiButtonProps) => {
    const id = useId();
    return (
        <Button
            id={id}
            className={cn(`w-[${BUTTON_SIZE}px] h-[${BUTTON_SIZE}px] text-xl`)}
            variant={isSelected ? "outline-solid" : "ghost"}
            onClick={onClick}
            role="option"
            aria-disabled={false}
            data-disabled={false}
            cmdk-item=""
            aria-selected={isSelected}
            data-selected={isSelected}
        >
            {emoji}
        </Button>
    );
};

EmojiButton.displayName = "EmojiButton";
