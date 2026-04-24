import { useState } from 'react';

interface Props {
    totalSeconds: number;
    onChange: (totalSeconds: number) => void;
}

function pad(n: number) {
    return String(n).padStart(2, '0');
}

const INPUT_CLASS =
    'h-9 w-14 rounded-lg border border-input bg-transparent text-center text-sm font-mono outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

export default function TimePicker({ totalSeconds, onChange }: Props) {
    const derived = {
        h: Math.floor(totalSeconds / 3600),
        m: Math.floor((totalSeconds % 3600) / 60),
        s: totalSeconds % 60,
    };

    // Local string state so typing isn't blocked by re-derivation from totalSeconds
    const [raw, setRaw] = useState({
        h: pad(derived.h),
        m: pad(derived.m),
        s: pad(derived.s),
    });

    // Sync raw display when parent resets the value from outside
    const syncedH = pad(derived.h);
    const syncedM = pad(derived.m);
    const syncedS = pad(derived.s);
    if (raw.h !== syncedH && document.activeElement?.id !== 'tp-h') setRaw((r) => ({ ...r, h: syncedH }));
    if (raw.m !== syncedM && document.activeElement?.id !== 'tp-m') setRaw((r) => ({ ...r, m: syncedM }));
    if (raw.s !== syncedS && document.activeElement?.id !== 'tp-s') setRaw((r) => ({ ...r, s: syncedS }));

    const commit = (part: 'h' | 'm' | 's', value: string) => {
        const n = parseInt(value) || 0;
        const clamped = part === 'h' ? Math.max(0, n) : Math.min(59, Math.max(0, n));
        const h = part === 'h' ? clamped : derived.h;
        const m = part === 'm' ? clamped : derived.m;
        const s = part === 's' ? clamped : derived.s;
        onChange(h * 3600 + m * 60 + s);
        setRaw((r) => ({ ...r, [part]: pad(clamped) }));
    };

    return (
        <div className="flex items-center gap-1.5">
            <input
                id="tp-h"
                type="text"
                inputMode="numeric"
                value={raw.h}
                onChange={(e) => setRaw((r) => ({ ...r, h: e.target.value }))}
                onBlur={(e) => commit('h', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commit('h', raw.h); }}
                className={INPUT_CLASS}
            />
            <span className="text-xs text-muted-foreground">h</span>
            <input
                id="tp-m"
                type="text"
                inputMode="numeric"
                value={raw.m}
                onChange={(e) => setRaw((r) => ({ ...r, m: e.target.value }))}
                onBlur={(e) => commit('m', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commit('m', raw.m); }}
                className={INPUT_CLASS}
            />
            <span className="text-xs text-muted-foreground">m</span>
            <input
                id="tp-s"
                type="text"
                inputMode="numeric"
                value={raw.s}
                onChange={(e) => setRaw((r) => ({ ...r, s: e.target.value }))}
                onBlur={(e) => commit('s', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commit('s', raw.s); }}
                className={INPUT_CLASS}
            />
            <span className="text-xs text-muted-foreground">s</span>
        </div>
    );
}
