import { Input } from '@/components/ui/shadcn_ui/input';
import { ArrowRight, X } from 'lucide-react';
import type { MatchingForm } from '../../../../../../types/quizCreationTypes';
import { createPair } from '../../../../../../types/quizCreationTypes';

interface Props {
    question: MatchingForm;
    onChange: (updated: MatchingForm) => void;
}

export default function MatchingEditor({ question, onChange }: Props) {
    const updatePair = (clientId: string, field: 'leftSide' | 'rightSide', value: string) => {
        onChange({
            ...question,
            pairs: question.pairs.map((p) => (p.clientId === clientId ? { ...p, [field]: value } : p)),
        });
    };

    const addPair = () => {
        onChange({ ...question, pairs: [...question.pairs, createPair()] });
    };

    const removePair = (clientId: string) => {
        if (question.pairs.length <= 2) return;
        onChange({ ...question, pairs: question.pairs.filter((p) => p.clientId !== clientId) });
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2 px-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Left</span>
                <span />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Right</span>
                <span />
            </div>
            {question.pairs.map((pair) => (
                <div key={pair.clientId} className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                    <Input
                        value={pair.leftSide}
                        onChange={(e) => updatePair(pair.clientId, 'leftSide', e.target.value)}
                        placeholder="Left side"
                    />
                    <ArrowRight size={16} className="shrink-0 text-muted-foreground" />
                    <Input
                        value={pair.rightSide}
                        onChange={(e) => updatePair(pair.clientId, 'rightSide', e.target.value)}
                        placeholder="Right side"
                    />
                    <button
                        type="button"
                        onClick={() => removePair(pair.clientId)}
                        disabled={question.pairs.length <= 2}
                        className="text-muted-foreground transition-colors hover:text-destructive hover:cursor-pointer disabled:pointer-events-none disabled:opacity-30"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addPair}
                className="mt-1 self-start text-sm text-primary hover:text-primary/70 transition-colors hover:cursor-pointer"
            >
                + Add pair
            </button>
        </div>
    );
}
