import { Input } from '@/components/ui/shadcn_ui/input';
import { cn } from '@/lib/utils';
import type { TextInputForm } from '../../../../../../types/quizCreationTypes';

interface Props {
    question: TextInputForm;
    onChange: (updated: TextInputForm) => void;
}

export default function TextInputEditor({ question, onChange }: Props) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">Review type</span>
                <div className="flex gap-2">
                    {(['AUTOMATIC', 'MANUAL'] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => onChange({ ...question, reviewType: type })}
                            className={cn(
                                'rounded-lg border-2 px-4 py-1.5 text-sm font-medium transition-colors hover:cursor-pointer',
                                question.reviewType === type
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                            )}
                        >
                            {type === 'AUTOMATIC' ? 'Automatic' : 'Manual'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">
                    Correct answer{question.reviewType === 'MANUAL' && (
                        <span className="ml-1 opacity-60">(optional)</span>
                    )}
                </span>
                <Input
                    value={question.correctAnswer}
                    onChange={(e) => onChange({ ...question, correctAnswer: e.target.value })}
                    placeholder={
                        question.reviewType === 'AUTOMATIC'
                            ? 'Enter the correct answer'
                            : 'Enter the correct answer (optional)'
                    }
                />
                {question.reviewType === 'MANUAL' && (
                    <p className="text-xs text-muted-foreground">
                        The student will self-assess their answer after submission.
                    </p>
                )}
            </div>
        </div>
    );
}
