import { Input } from '@/components/ui/shadcn_ui/input';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { ChoiceOption, SingleChoiceForm } from '../../../../../../types/quizCreationTypes';
import { createOption } from '../../../../../../types/quizCreationTypes';

interface Props {
    question: SingleChoiceForm;
    onChange: (updated: SingleChoiceForm) => void;
}

export default function SingleChoiceEditor({ question, onChange }: Props) {
    const setOptionText = (clientId: string, text: string) => {
        onChange({
            ...question,
            options: question.options.map((o) => (o.clientId === clientId ? { ...o, text } : o)),
        });
    };

    const setCorrect = (clientId: string) => {
        onChange({
            ...question,
            options: question.options.map((o) => ({ ...o, isCorrect: o.clientId === clientId })),
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
            <span className="text-xs text-muted-foreground">Select the correct answer</span>
            {question.options.map((option: ChoiceOption) => (
                <div key={option.clientId} className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCorrect(option.clientId)}
                        className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors hover:cursor-pointer',
                            option.isCorrect
                                ? 'border-primary bg-primary'
                                : 'border-border hover:border-primary/60',
                        )}
                    >
                        {option.isCorrect && (
                            <span className="h-2 w-2 rounded-full bg-primary-foreground" />
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
