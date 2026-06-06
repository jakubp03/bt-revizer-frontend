import type { AttemptReviewResponse } from '@/types/quiz';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Props = {
    review: AttemptReviewResponse;
    quizId: string;
};

export default function ReviewTopBar({ review, quizId }: Props) {
    const navigate = useNavigate();
    const scoreColor =
        review.scorePercentage >= 80
            ? 'text-green-600 dark:text-green-400'
            : review.scorePercentage >= 50
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400';

    return (
        <div className="flex h-12 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm font-medium truncate max-w-xs">{review.quizTitle}</span>
            </div>
        </div>
    );
}
