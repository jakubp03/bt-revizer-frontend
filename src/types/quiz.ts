export interface QuizResultResponse {
    attemptId: number;
    scorePercentage: number;
    previousAttemptScorePercentage: number | null;
    averageScorePercentage: number;
}
