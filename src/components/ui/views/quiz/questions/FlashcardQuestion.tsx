import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFlashcardAnswer } from '@/store/slices/quizPlaySlice';
import type { QuestionInfo } from '@/types/quiz';
import { Check, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../shadcn_ui/button';

export default function FlashcardQuestion({ question }: { question: QuestionInfo }) {
    const dispatch = useAppDispatch();
    const flashcardState = useAppSelector((s) => s.quizPlay.flashcardAnswers[question.id.toString()]);
    const [isFlipped, setIsFlipped] = useState(false);
    const hasAnswered = flashcardState !== undefined;

    const handleMark = (correct: boolean) => {
        dispatch(setFlashcardAnswer({ questionId: question.id.toString(), correct }));
    };

    const handleReset = () => {
        setIsFlipped(false);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-lg rounded-xl border bg-card p-8 text-center shadow-sm">
                {!isFlipped ? (
                    <>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Front side
                        </p>
                        <p className="text-lg">{question.questionText}</p>
                    </>
                ) : (
                    <>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Back side
                        </p>
                        <p className="text-lg">{question.flashcard?.backText}</p>
                    </>
                )}
            </div>

            {!isFlipped ? (
                <Button variant="outline" onClick={() => setIsFlipped(true)}>
                    <RotateCcw size={16} className="mr-1.5" />
                    Flip card
                </Button>
            ) : (
                <div className="flex items-center gap-3">
                    <Button
                        variant={hasAnswered && flashcardState === false ? 'destructive' : 'outline'}
                        onClick={() => handleMark(false)}
                        className="gap-1.5"
                    >
                        <X size={16} />
                        Didn&apos;t recall
                    </Button>
                    <Button
                        variant={hasAnswered && flashcardState === true ? 'default' : 'outline'}
                        onClick={() => handleMark(true)}
                        className="gap-1.5"
                    >
                        <Check size={16} />
                        Recalled
                    </Button>
                    {hasAnswered && (
                        <Button variant="ghost" size="sm" onClick={handleReset}>
                            <RotateCcw size={14} />
                        </Button>
                    )}
                </div>
            )}

            {hasAnswered && (
                <p className={`text-sm font-medium ${flashcardState ? 'text-green-600' : 'text-red-500'}`}>
                    {flashcardState ? 'Marked as recalled' : 'Marked as not recalled'}
                </p>
            )}
        </div>
    );
}
