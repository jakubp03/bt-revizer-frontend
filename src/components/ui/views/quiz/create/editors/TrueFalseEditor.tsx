import { cn } from '@/lib/utils';
import type { TrueFalseForm } from '../../../../../../types/quizCreationTypes';

interface Props {
    question: TrueFalseForm;
    onChange: (updated: TrueFalseForm) => void;
}

export default function TrueFalseEditor({ question, onChange }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Select the correct answer</span>
            <div className="flex gap-3">
                {([true, false] as const).map((value) => (
                    <button
                        key={String(value)}
                        type="button"
                        onClick={() => onChange({ ...question, correctAnswer: value })}
                        className={cn(
                            'flex-1 rounded-lg border-2 py-2.5 text-sm font-medium transition-colors hover:cursor-pointer',
                            question.correctAnswer === value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                        )}
                    >
                        {value ? 'True' : 'False'}
                    </button>
                ))}
            </div>
        </div>
    );
}
