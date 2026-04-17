import api from '@/services/Api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchQuizById } from '@/store/thunks/quizThunks';
import {
    AlarmClock,
    AlarmClockOff,
    ChartNoAxesColumn,
    Play,
    Star
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import submitData from '../../../../../test_data/submit_quiz_50pct.json';
import { Button } from '../../shadcn_ui/button';
import { Card, CardContent } from '../../shadcn_ui/card';
import LoadingSpinner from '../../shared/LoadingSpinner';

function QuizStartView({ onStart }: { onStart: () => void }) {
    const { selectedQuiz } = useAppSelector((state) => state.quiz);
    if (!selectedQuiz) return null;

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center gap-6 pt-6">
                    <span className="text-4xl">{selectedQuiz.icon || '📝'}</span>
                    <h1 className="text-2xl font-bold text-foreground">{selectedQuiz.title}</h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <ChartNoAxesColumn size={16} className="text-primary" />
                            <span>{selectedQuiz.questionCount} {selectedQuiz.questionCount === 1 ? 'question' : 'questions'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Star size={16} className="text-primary" />
                            <span>{selectedQuiz.totalPoints} points</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {selectedQuiz.timeLimit ? (
                                <>
                                    <AlarmClock size={16} className="text-primary" />
                                    <span>{selectedQuiz.timeLimit}s</span>
                                </>
                            ) : (
                                <>
                                    <AlarmClockOff size={16} className="text-muted-foreground" />
                                    <span>No time limit</span>
                                </>
                            )}
                        </div>
                    </div>

                    <Button className="mt-2 gap-2" size="lg" onClick={onStart}>
                        <Play size={18} fill="currentColor" />
                        Start
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function QuizView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { selectedQuiz, isLoadingSelected } = useAppSelector((state) => state.quiz);
    const [isOngoing, setIsOngoing] = useState(false);

    useEffect(() => {
        if (id && selectedQuiz?.id?.toString() !== id) {
            dispatch(fetchQuizById(id));
        }
    }, [id, selectedQuiz?.id, dispatch]);

    const handleSubmit = async () => {
        const response = await api.post('/quiz/submitQuiz', submitData);
        navigate(`/quiz/${id}/results/${response.data.attemptId}`, {
            state: { results: response.data },
        });
    };

    if (isLoadingSelected || !selectedQuiz) {
        return (
            <LoadingSpinner />
        );
    }

    if (!isOngoing) {
        return <QuizStartView onStart={() => setIsOngoing(true)} />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
}
