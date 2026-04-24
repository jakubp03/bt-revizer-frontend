import { Input } from '@/components/ui/shadcn_ui/input';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { ChoiceOption, MultipleChoiceForm } from '../../../../../../types/quizCreationTypes';
import { createOption } from '../../../../../../types/quizCreationTypes';

interface Props {
    question: MultipleChoiceForm;
    onChange: (updated: MultipleChoiceForm) => void;
}

export default function MultipleChoiceEditor({ question, onChange }: Props) {
    const setOptionText = (clientId: string, text: string) => {
        onChange({
            ...question,
            options: question.options.map((o) => (o.clientId === clientId ? { ...o, text } : o)),
        });
    };

    const toggleCorrect = (clientId: string) => {
        onChange({
            ...question,
            options: question.options.map((o) =>
                o.clientId === clientId ? { ...o, isCorrect: !o.isCorrect } : o,
            ),
        });
    };

    const addOption = () => {
        onChange({ ...question, options: [...question.options, createOption()] });
    };

    const removeOption = (clientId: string) => {
        if (question.options.length <= 2) return;
        onChange({
            ...question,
            options: question.options.filter((o) => o.clientId !== clientId),
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Select all correct answers</span>
            {question.options.map((option: ChoiceOption) => (
                <div key={option.clientId} className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => toggleCorrect(option.clientId)}
                        className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors hover:cursor-pointer',
                            option.isCorrect
                                ? 'border-primary bg-primary'
                                : 'border-border hover:border-primary/60',
                        )}
                    >
                        {option.isCorrect && (
                            <svg
                                className="h-3 w-3 text-primary-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>
                    <Input
                        value={option.text}
                        onChange={(e) => setOptionText(option.clientId, e.target.value)}
                        placeholder="Option text"
                        className="flex-1"
                    />
                    <button
                        type="button"
                        onClick={() => removeOption(option.clientId)}
                        disabled={question.options.length <= 2}
                        className="text-muted-foreground transition-colors hover:text-destructive hover:cursor-pointer disabled:pointer-events-none disabled:opacity-30"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addOption}
                className="mt-1 self-start text-sm text-primary hover:text-primary/70 transition-colors hover:cursor-pointer"
            >
                + Add option
            </button>
        </div>
    );
}
