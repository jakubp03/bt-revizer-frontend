import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearReview } from '@/store/slices/attemptReviewSlice';
import { fetchAttemptReview } from '@/store/thunks/quizThunks';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../shared/LoadingSpinner';
import ReviewOverview from './review/ReviewOverview';
import ReviewQuestionRenderer from './review/ReviewQuestionRenderer';
import ReviewSidebar from './review/ReviewSidebar';
import ReviewTopBar from './review/ReviewTopBar';

export default function QuizAttemptReviewView() {
    const { id, attemptId } = useParams<{ id: string; attemptId: string }>();
    const dispatch = useAppDispatch();
    const { reviewData, isLoading, currentIndex } = useAppSelector((s) => s.attemptReview);

    useEffect(() => {
        if (!attemptId) return;
        dispatch(fetchAttemptReview(attemptId));
        return () => {
            dispatch(clearReview());
        };
    }, [attemptId, dispatch]);

    if (isLoading || !reviewData) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const currentQuestion = currentIndex >= 0 ? reviewData.questions[currentIndex] : null;

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <ReviewTopBar review={reviewData} quizId={id ?? ''} />
            <div className="flex flex-1 overflow-hidden">
                <ReviewSidebar questions={reviewData.questions} />
                <main className="flex-1 overflow-y-auto p-6">
                    {currentIndex === -1 ? (
                        <ReviewOverview review={reviewData} />
                    ) : currentQuestion ? (
                        <ReviewQuestionRenderer question={currentQuestion} />
                    ) : null}
                </main>
            </div>
        </div>
    );
}

