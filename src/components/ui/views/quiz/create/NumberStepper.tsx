import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface Props {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: number) => void;
    className?: string;
}

export default function NumberStepper({
    value,
    min = 1,
    max,
    step = 1,
    onChange,
    className,
}: Props) {
    const [inputVal, setInputVal] = useState(String(value));

    // Keep local string in sync when external value changes (e.g. reset)
    // but only if it differs from what would parse to value, so we don't
    // clobber in-progress typing
    const parsedInput = parseInt(inputVal);
    if (!isNaN(parsedInput) && parsedInput !== value && String(value) !== inputVal) {
        setInputVal(String(value));
    }

    const clamp = (n: number) => {
        let clamped = n;
        if (min !== undefined) clamped = Math.max(min, clamped);
        if (max !== undefined) clamped = Math.min(max, clamped);
        return clamped;
    };

    const commit = (raw: string) => {
        const parsed = parseInt(raw);
        const clamped = isNaN(parsed) ? (min ?? 1) : clamp(parsed);
        setInputVal(String(clamped));
        onChange(clamped);
    };

    const decrement = () => {
        const next = clamp(value - step);
        setInputVal(String(next));
        onChange(next);
    };

    const increment = () => {
        const next = clamp(value + step);
        setInputVal(String(next));
        onChange(next);
    };

    return (
        <div className={cn('flex items-center rounded-lg border border-input overflow-hidden', className)}>
            <button
                type="button"
                onClick={decrement}
                disabled={min !== undefined && value <= min}
                className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:cursor-pointer disabled:pointer-events-none disabled:opacity-30"
            >
                <Minus size={14} />
            </button>
            <input
                type="text"
                inputMode="numeric"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onBlur={(e) => commit(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') commit((e.target as HTMLInputElement).value);
                }}
                className="h-8 w-12 bg-transparent text-center text-sm outline-none"
            />
            <button
                type="button"
                onClick={increment}
                disabled={max !== undefined && value >= max}
                className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:cursor-pointer disabled:pointer-events-none disabled:opacity-30"
            >
                <Plus size={14} />
            </button>
        </div>
    );
}
