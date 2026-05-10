const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

const BUCKETS: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Infinity, "year"],
];

export function formatRelativeTime(iso: string, now: number = Date.now()): string {
    let seconds = (now - new Date(iso).getTime()) / 1000;
    let unit: Intl.RelativeTimeFormatUnit = "second";
    for (const [div, u] of BUCKETS) {
        if (Math.abs(seconds) < div) {
            unit = u;
            break;
        }
        seconds /= div;
        unit = u;
    }
    return rtf.format(-Math.round(seconds), unit);
}

const absoluteFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

export function formatAbsoluteDateTime(iso: string): string {
    return absoluteFormatter.format(new Date(iso));
}
