import { useAppDispatch } from '@/store/hooks';
import { setReviewIndex } from '@/store/slices/attemptReviewSlice';
import type { AttemptReviewResponse, QuestionReview } from '@/types/quiz';
import { Calendar, ChartNoAxesColumn, Check, Circle, Clock, Star, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shadcn_ui/card';

function getStatus(q: QuestionReview): 'correct' | 'partial' | 'incorrect' {
    if (q.scorePercentage >= 100) return 'correct';
    if (q.scorePercentage > 0) return 'partial';
    return 'incorrect';
}

function formatTime(seconds: number | null): string {
    if (seconds === null) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
}

type Props = {
    review: AttemptReviewResponse;
};

export default function ReviewOverview({ review }: Props) {
    const dispatch = useAppDispatch();

    const scoreColor =
        review.scorePercentage >= 80
            ? 'text-green-600 dark:text-green-400'
            : review.scorePercentage >= 50
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400';

    const submittedAt = new Date(review.submittedAt).toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{review.quizTitle}</h1>
                <p className="mt-1 text-sm text-muted-foreground">Attempt overview</p>
            </div>

            {/* Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-foreground">Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Star size={16} className="text-primary" />
                            <span className="text-muted-foreground">Score:</span>
                            <span className={`font-semibold ${scoreColor}`}>
                                {Math.round(review.score * 10) / 10}/{review.maxScore}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <ChartNoAxesColumn size={16} className="text-primary" />
                            <span className="text-muted-foreground">Percentage:</span>
                            <span className={`font-semibold ${scoreColor}`}>
                                {Math.round(review.scorePercentage)}%
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock size={16} className="text-primary" />
                            <span className="text-muted-foreground">Time:</span>
                            <span className="font-medium">{formatTime(review.timeSpent)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar size={16} className="text-primary" />
                            <span className="text-muted-foreground">Submitted:</span>
                            <span className="font-medium">{submittedAt}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Question list */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-foreground">Questions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ul className="flex flex-col">
                        {review.questions.map((q, i) => {
                            const status = getStatus(q);
                            return (
                                <li key={q.questionId}>
                                    <button
                                        type="button"
                                        onClick={() => dispatch(setReviewIndex(i))}
                                        className="flex w-full items-center justify-between px-6 py-3 text-sm transition-colors hover:bg-muted text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex-shrink-0">
                                                {status === 'correct' && <Check size={16} className="text-green-500" />}
                                                {status === 'partial' && <Circle size={16} className="text-yellow-500" />}
                                                {status === 'incorrect' && <X size={16} className="text-red-500" />}
                                            </span>
                                            <span className="font-medium">Q{q.questionOrder}</span>
                                            <span className="text-muted-foreground truncate max-w-sm">{q.questionText}</span>
                                        </div>
                                        <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                                            <span className={`font-semibold text-xs ${status === 'correct' ? 'text-green-600 dark:text-green-400' :
                                                status === 'partial' ? 'text-yellow-600 dark:text-yellow-400' :
                                                    'text-red-600 dark:text-red-400'
                                                }`}>
                                                {status === 'correct' ? 'correct' : status === 'partial' ? 'partially correct' : 'incorrect'}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {Math.round(q.pointsAwarded * 10) / 10}/{q.points}
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
