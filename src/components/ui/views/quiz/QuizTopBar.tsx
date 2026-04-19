import { useAppSelector } from '@/store/hooks';
import { selectAnsweredCount } from '@/store/slices/quizPlaySlice';
import type { QuestionInfo } from '@/types/quiz';
import { Clock, SendHorizonal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../shadcn_ui/button';

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

type Props = {
    questions: QuestionInfo[];
    timeLimit: number | null;
    onSubmit: () => void;
    onTimeUp: () => void;
};

export default function QuizTopBar({ questions, timeLimit, onSubmit, onTimeUp }: Props) {
    const answeredCount = useAppSelector(selectAnsweredCount(questions));
    const totalCount = questions.length;
    const progressPercent = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

    const [timeRemaining, setTimeRemaining] = useState<number | null>(timeLimit);

    const handleTimeUp = useCallback(() => {
        onTimeUp();
    }, [onTimeUp]);

    useEffect(() => {
        if (timeRemaining === null) return;
        if (timeRemaining <= 0) {
            handleTimeUp();
            return;
        }
        const interval = setInterval(() => {
            setTimeRemaining((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);
        return () => clearInterval(interval);
    }, [timeRemaining, handleTimeUp]);

    const isLowTime = timeRemaining !== null && timeRemaining <= 30;

    return (
        <div className="flex h-12 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-4">
                {/* Timer */}
                {timeRemaining !== null && (
                    <div className={`flex items-center gap-1.5 text-sm font-mono ${isLowTime ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                        <Clock size={14} />
                        <span>{formatTime(timeRemaining)}</span>
                    </div>
                )}

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {answeredCount}/{totalCount}
                    </span>
                </div>
            </div>

            <Button size="sm" onClick={onSubmit} className="gap-1.5">
                <SendHorizonal size={14} />
                Submit
            </Button>
        </div>
    );
}
