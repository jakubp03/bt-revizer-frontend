import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setIdBasedAnswer } from '@/store/slices/quizPlaySlice';
import type { QuestionInfo } from '@/types/quiz';

export default function TrueFalseQuestion({ question }: { question: QuestionInfo }) {
    const dispatch = useAppDispatch();
    const selected = useAppSelector((s) => s.quizPlay.idBasedAnswers[question.id.toString()]);
    const selectedId = selected?.[0] ?? null;

    const handleSelect = (optionId: string) => {
        dispatch(setIdBasedAnswer({ questionId: question.id.toString(), optionIds: [optionId] }));
    };

    return (
        <div className="flex gap-4">
            {question.choiceOptions.map((opt) => (
                <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id.toString())}
                    className={`flex-1 rounded-lg border p-4 text-center text-sm font-medium transition-colors ${selectedId === opt.id.toString() ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted/50'}`}
                >
                    {opt.text}
                </button>
            ))}
        </div>
    );
}
