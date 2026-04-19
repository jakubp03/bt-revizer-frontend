import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setIsManualReviewOpen, setManualReviewResult } from '@/store/slices/quizPlaySlice';
import type { QuestionInfo } from '@/types/quiz';
import { Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../shadcn_ui/button';
import { Card, CardContent } from '../../shadcn_ui/card';

type Props = {
    questions: QuestionInfo[];
    onComplete: () => void;
};

export default function ManualReviewDialog({ questions, onComplete }: Props) {
    const dispatch = useAppDispatch();
    const textAnswers = useAppSelector((s) => s.quizPlay.textBasedAnswers);
    const manualResults = useAppSelector((s) => s.quizPlay.manualReviewResults);

    const manualQuestions = useMemo(
        () => questions.filter((q) => q.type === 'TEXT_INPUT' && q.textConfig?.review === 'MANUAL'),
        [questions],
    );

    const [currentIndex, setCurrentIndex] = useState(0);

    if (manualQuestions.length === 0) {
        // No manual review needed, complete immediately
        dispatch(setIsManualReviewOpen(false));
        onComplete();
        return null;
    }

    const currentQuestion = manualQuestions[currentIndex];
    const qId = currentQuestion.id.toString();
    const userAnswer = textAnswers[qId] ?? '';
    const correctAnswer = currentQuestion.textConfig?.correctAnswer ?? '';
    const alreadyReviewed = qId in manualResults;

    const handleMark = (correct: boolean) => {
        dispatch(setManualReviewResult({ questionId: qId, correct }));

        if (currentIndex < manualQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            dispatch(setIsManualReviewOpen(false));
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-lg">
                <CardContent className="flex flex-col gap-5 pt-6">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Manual review — {currentIndex + 1} of {manualQuestions.length}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">{currentQuestion.questionText}</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Your answer</p>
                            <p className="mt-1 rounded-lg border bg-muted/30 p-3 text-sm">
                                {userAnswer || <span className="italic text-muted-foreground">No answer provided</span>}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Correct answer</p>
                            <p className="mt-1 rounded-lg border border-green-200 bg-green-50 p-3 text-sm dark:border-green-900 dark:bg-green-950">
                                {correctAnswer}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <Button
                            variant="destructive"
                            onClick={() => handleMark(false)}
                            className="gap-1.5"
                            disabled={alreadyReviewed}
                        >
                            <X size={16} />
                            Incorrect
                        </Button>
                        <Button
                            onClick={() => handleMark(true)}
                            className="gap-1.5"
                            variant="success"
                            disabled={alreadyReviewed}
                        >
                            <Check size={16} />
                            Correct
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
