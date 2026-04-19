import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setIdBasedAnswer } from '@/store/slices/quizPlaySlice';
import type { QuestionInfo } from '@/types/quiz';

export default function SingleChoiceQuestion({ question }: { question: QuestionInfo }) {
    const dispatch = useAppDispatch();
    const selected = useAppSelector((s) => s.quizPlay.idBasedAnswers[question.id.toString()]);
    const selectedId = selected?.[0] ?? null;

    const handleSelect = (optionId: string) => {
        dispatch(setIdBasedAnswer({ questionId: question.id.toString(), optionIds: [optionId] }));
    };

    return (
        <div className="flex flex-col gap-3">
            {question.choiceOptions.map((opt) => (
                <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${selectedId === opt.id.toString() ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                >
                    <input
                        type="radio"
                        name={`q-${question.id}`}
                        checked={selectedId === opt.id.toString()}
                        onChange={() => handleSelect(opt.id.toString())}
                        className="accent-primary"
                    />
                    <span className="text-sm">{opt.text}</span>
                </label>
            ))}
        </div>
    );
}
