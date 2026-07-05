export type Category = {
    id: string;
    name: string;
    description: string;
    color: string;
}

export type CategoryStats = {
    attemptTimes: number[];
    scorePercentages: number[];
    averageScorePercentage: number | null;
    medianScorePercentage: number | null;
    averageAttemptTime: number | null;
    medianAttemptTime: number | null;
};