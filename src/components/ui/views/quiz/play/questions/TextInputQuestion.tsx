import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTextBasedAnswer } from '@/store/slices/quizPlaySlice';
import type { QuestionInfo } from '@/types/quiz';

export default function TextInputQuestion({ question }: { question: QuestionInfo }) {
    const dispatch = useAppDispatch();
    const answer = useAppSelector((s) => s.quizPlay.textBasedAnswers[question.id.toString()]) ?? '';

    return (
        <div className="flex flex-col gap-2">
            <textarea
                value={answer}
                onChange={(e) =>
                    dispatch(setTextBasedAnswer({ questionId: question.id.toString(), answer: e.target.value }))
                }
                placeholder="Type your answer here..."
                className="min-h-[120px] w-full resize-y rounded-lg border border-border bg-transparent p-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50"
            />
            {question.textConfig?.review === 'MANUAL' && (
                <p className="text-xs text-muted-foreground">
                    This answer will be self-reviewed after submission.
                </p>
            )}
        </div>
    );
}
