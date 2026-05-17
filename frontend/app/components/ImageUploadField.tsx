import {
    createContext,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { DrawerDialog } from "@/components/DrawerDialog";
import { cn } from "@/lib/utils";

export type ImageUploadStatus = "idle" | "uploading" | "removing";

interface ConfirmRemoveCopy {
    title: string;
    description?: string;
    confirmLabel?: string;
}

interface ImageUploadFieldContextValue {
    status: ImageUploadStatus;
    busy: boolean;
    hasImage: boolean;
    error: string | null;
    openPicker: () => void;
    requestRemove: () => void;
}

const ImageUploadFieldContext = createContext<ImageUploadFieldContextValue | null>(null);

function useFieldContext(component: string): ImageUploadFieldContextValue {
    const ctx = useContext(ImageUploadFieldContext);
    if (!ctx) {
        throw new Error(`${component} must be rendered inside <ImageUploadField>`);
    }
    return ctx;
}

interface ImageUploadFieldProps {
    accept?: string;
    hasImage: boolean;
    onUpload: (file: File) => Promise<void>;
    onRemove: () => Promise<void>;
    confirmRemove: ConfirmRemoveCopy;
    children: ReactNode;
    className?: string;
}

function Root({
    accept = "image/png,image/jpeg,image/webp",
    hasImage,
    onUpload,
    onRemove,
    confirmRemove,
    children,
    className,
}: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<ImageUploadStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const busy = status !== "idle";

    const openPicker = () => {
        if (busy) return;
        setError(null);
        inputRef.current?.click();
    };

    const handleFile = async (file: File) => {
        setError(null);
        setStatus("uploading");
        try {
            await onUpload(file);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
        } finally {
            setStatus("idle");
        }
    };

    const requestRemove = () => {
        if (busy) return;
        setError(null);
        setConfirmOpen(true);
    };

    const handleConfirmRemove = async () => {
        setError(null);
        setStatus("removing");
        try {
            await onRemove();
            setConfirmOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not remove image.");
        } finally {
            setStatus("idle");
        }
    };

    const contextValue = useMemo<ImageUploadFieldContextValue>(
        () => ({
            status,
            busy,
            hasImage,
            error,
            openPicker,
            requestRemove,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [status, busy, hasImage, error]
    );

    return (
        <ImageUploadFieldContext.Provider value={contextValue}>
            <div className={cn("flex flex-col gap-3", className)}>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    hidden
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void handleFile(file);
                        event.target.value = "";
                    }}
                />
                {children}
                <DrawerDialog
                    open={confirmOpen}
                    onOpenChange={(next) => {
                        if (status === "removing") return;
                        setConfirmOpen(next);
                        if (!next) setError(null);
                    }}
                    title={confirmRemove.title}
                    description={confirmRemove.description}
                    footer={
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={status === "removing"}
                                onClick={() => setConfirmOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                busy={status === "removing"}
                                disabled={status === "removing"}
                                onClick={handleConfirmRemove}
                            >
                                {confirmRemove.confirmLabel ?? "Remove"}
                            </Button>
                        </div>
                    }
                >
                    {error ? <p className="text-sm text-destructive">{error}</p> : null}
                </DrawerDialog>
            </div>
        </ImageUploadFieldContext.Provider>
    );
}

function Display({ children, className }: { children: ReactNode; className?: string }) {
    useFieldContext("ImageUploadField.Display");
    return <div className={className}>{children}</div>;
}

interface TriggerProps {
    label?: { idle: string; uploading?: string; change?: string };
    className?: string;
}

function UploadTrigger({ label, className }: TriggerProps) {
    const { status, busy, hasImage, openPicker } = useFieldContext("ImageUploadField.UploadTrigger");
    const idleLabel = hasImage
        ? (label?.change ?? "change")
        : (label?.idle ?? "upload");
    const text = status === "uploading" ? (label?.uploading ?? "uploading") : idleLabel;
    return (
        <Button
            type="button"
            variant="outline"
            size="terminal"
            disabled={busy}
            onClick={openPicker}
            className={className}
        >
            <span aria-hidden>▸</span>
            <span>{text}</span>
        </Button>
    );
}

function RemoveTrigger({
    label = "remove",
    className,
}: {
    label?: string;
    className?: string;
}) {
    const { busy, hasImage, requestRemove } = useFieldContext("ImageUploadField.RemoveTrigger");
    if (!hasImage) return null;
    return (
        <Button
            type="button"
            variant="destructive"
            size="terminal"
            disabled={busy}
            onClick={requestRemove}
            className={className}
        >
            <span aria-hidden>✕</span>
            <span>{label}</span>
        </Button>
    );
}

function ErrorMessage({ className }: { className?: string }) {
    const { error } = useFieldContext("ImageUploadField.Error");
    if (!error) return null;
    return (
        <p
            className={cn(
                "font-mono text-[11px] uppercase tracking-[0.18em] text-destructive",
                className
            )}
            role="alert"
        >
            <span aria-hidden className="mr-2">
                !
            </span>
            {error}
        </p>
    );
}

export function useImageUploadFieldStatus(): {
    status: ImageUploadStatus;
    busy: boolean;
    hasImage: boolean;
} {
    const ctx = useFieldContext("useImageUploadFieldStatus");
    return { status: ctx.status, busy: ctx.busy, hasImage: ctx.hasImage };
}

export const ImageUploadField = Object.assign(Root, {
    Display,
    UploadTrigger,
    RemoveTrigger,
    Error: ErrorMessage,
});

export type { ConfirmRemoveCopy };
