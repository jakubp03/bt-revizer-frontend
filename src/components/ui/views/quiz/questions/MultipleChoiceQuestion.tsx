import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setIdBasedAnswer } from '@/store/slices/quizPlaySlice';
import type { QuestionInfo } from '@/types/quiz';

export default function MultipleChoiceQuestion({ question }: { question: QuestionInfo }) {
    const dispatch = useAppDispatch();
    const selected = useAppSelector((s) => s.quizPlay.idBasedAnswers[question.id.toString()]) ?? [];

    const handleToggle = (optionId: string) => {
        const next = selected.includes(optionId)
            ? selected.filter((id) => id !== optionId)
            : [...selected, optionId];
        dispatch(setIdBasedAnswer({ questionId: question.id.toString(), optionIds: next }));
    };

    return (
        <div className="flex flex-col gap-3">
            {question.choiceOptions.map((opt) => {
                const isChecked = selected.includes(opt.id.toString());
                return (
                    <label
                        key={opt.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${isChecked ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                    >
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggle(opt.id.toString())}
                            className="accent-primary"
                        />
                        <span className="text-sm">{opt.text}</span>
                    </label>
                );
            })}
        </div>
    );
}
