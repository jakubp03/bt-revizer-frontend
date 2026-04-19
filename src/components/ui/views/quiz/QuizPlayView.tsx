import api from '@/services/Api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    resetQuizPlay,
    setIsManualReviewOpen,
    setIsSubmitting,
    startQuizPlay,
} from '@/store/slices/quizPlaySlice';
import type { QuizDetailed } from '@/types/quiz';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../shared/LoadingSpinner';
import ManualReviewDialog from './ManualReviewDialog';
import QuizLayout from './QuizLayout';
import QuestionRenderer from './questions/QuestionRenderer';

type Props = {
    quiz: QuizDetailed;
};

export default function QuizPlayView({ quiz }: Props) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        currentQuestionIndex,
        idBasedAnswers,
        textBasedAnswers,
        matchBasedAnswers,
        flashcardAnswers,
        manualReviewResults,
        isSubmitting,
        isManualReviewOpen,
        startTime,
    } = useAppSelector((s) => s.quizPlay);

    // Initialize play state on mount
    useEffect(() => {
        dispatch(startQuizPlay());
        return () => {
            dispatch(resetQuizPlay());
        };
    }, [dispatch]);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const hasManualReviewQuestions = quiz.questions.some(
        (q) => q.type === 'TEXT_INPUT' && q.textConfig?.review === 'MANUAL',
    );

    const buildSubmission = useCallback(() => {
        const timeSpent = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

        const idBased = Object.entries(idBasedAnswers).map(([questionId, selectedOptionIds]) => ({
            questionId: Number(questionId),
            selectedOptionIds: selectedOptionIds.map(Number),
        }));

        // Include flashcard answers as id-based (empty array = not recalled, we use questionId convention)
        const flashcardBased = Object.entries(flashcardAnswers).map(([questionId, correct]) => ({
            questionId: Number(questionId),
            selectedOptionIds: correct ? [Number(questionId)] : [],
        }));

        const textBased = Object.entries(textBasedAnswers).map(([questionId, submittedAnswer]) => {
            const q = quiz.questions.find((qu) => qu.id.toString() === questionId);
            const isManual = q?.textConfig?.review === 'MANUAL';
            return {
                questionId: Number(questionId),
                submittedAnswer,
                userMarkedCorrect: isManual ? (manualReviewResults[questionId] ?? null) : null,
            };
        });

        const matchBased = Object.entries(matchBasedAnswers).map(([questionId, pairs]) => ({
            questionId: Number(questionId),
            matchedPairs: pairs.map((p) => ({ leftId: Number(p.leftId), rightId: Number(p.rightId) })),
        }));

        return {
            quizId: Number(quiz.id),
            timeSpent,
            idBasedAnswers: [...idBased, ...flashcardBased],
            textBasedAnswers: textBased,
            matchBasedAttemptAnswer: matchBased,
        };
    }, [idBasedAnswers, textBasedAnswers, matchBasedAnswers, flashcardAnswers, manualReviewResults, quiz, startTime]);

    const submitToBackend = useCallback(async () => {
        dispatch(setIsSubmitting(true));
        try {
            const payload = buildSubmission();
            const response = await api.post('/attempt/submitAttempt', payload);
            navigate(`/quiz/${quiz.id}/results/${response.data.attemptId}`, {
                state: { results: response.data },
            });
        } catch (error) {
            console.error('Error submitting quiz:', error);
            dispatch(setIsSubmitting(false));
        }
    }, [buildSubmission, dispatch, navigate, quiz.id]);

    const handleSubmit = useCallback(() => {
        if (hasManualReviewQuestions) {
            dispatch(setIsManualReviewOpen(true));
        } else {
            submitToBackend();
        }
    }, [hasManualReviewQuestions, dispatch, submitToBackend]);

    const handleTimeUp = useCallback(() => {
        // Auto-submit: skip manual review on timeout
        submitToBackend();
    }, [submitToBackend]);

    const handleManualReviewComplete = useCallback(() => {
        submitToBackend();
    }, [submitToBackend]);

    if (isSubmitting) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            <QuizLayout
                questions={quiz.questions}
                timeLimit={quiz.timeLimit}
                onSubmit={handleSubmit}
                onTimeUp={handleTimeUp}
            >
                {currentQuestion && <QuestionRenderer question={currentQuestion} />}
            </QuizLayout>

            {isManualReviewOpen && (
                <ManualReviewDialog
                    questions={quiz.questions}
                    onComplete={handleManualReviewComplete}
                />
            )}
        </>
    );
}
