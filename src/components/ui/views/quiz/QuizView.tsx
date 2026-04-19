import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchQuizById } from '@/store/thunks/quizThunks';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../shared/LoadingSpinner';
import QuizPlayView from './QuizPlayView';
import QuizStartView from './QuizStartView';

export default function QuizView() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { selectedQuiz, isLoadingSelected } = useAppSelector((state) => state.quiz);
    const [isOngoing, setIsOngoing] = useState(false);

    useEffect(() => {
        if (id && selectedQuiz?.id?.toString() !== id) {
            dispatch(fetchQuizById(id));
        }
    }, [id, selectedQuiz?.id, dispatch]);

    if (isLoadingSelected || !selectedQuiz) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isOngoing) {
        return <QuizStartView onStart={() => setIsOngoing(true)} />;
    }

    return <QuizPlayView quiz={selectedQuiz} />;
}
