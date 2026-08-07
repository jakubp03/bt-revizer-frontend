import BackButton from '@/components/ui/shared/BackButton';
import type { AttemptReviewResponse } from '@/types/quiz';

type Props = {
    review: AttemptReviewResponse;
};

export default function ReviewTopBar({ review }: Props) {
    return (
        <div className="flex h-12 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-3">
                <BackButton />
                <span className="text-muted-foreground">/</span>
                <span className="text-sm font-medium truncate max-w-xs">{review.quizTitle}</span>
            </div>
        </div>
    );
}
