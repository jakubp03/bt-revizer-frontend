import type { Category } from "./category";

export interface QuizResultResponse {
    attemptId: number;
    scorePercentage: number;
    previousAttemptScorePercentage: number | null;
    averageScorePercentage: number;
}

export type Quiz = {
    id: string;
    title: string;
    icon: string;
    timeLimit: boolean;
    categories: Category[];
    questionCount: number;
}

export type QuizDetailed = {
    id: string;
    title: string;
    description: string;
    icon: string;
    timeLimit: number | null;
    totalPoints: number;
    questionCount: number;
    categories: Category[];
    questions: QuestionInfo[];
    createdAt: string;
    updatedAt: string;
};

export type QuestionAttemptInfo = {
    questionId: string;
    averageQuestionAttemptTime: number | null;
    averageQuestionScorePercentage: number;
};

export type QuizStats = {
    attemptTimes: number[];
    scorePercentages: number[];
    previousAttemptScorePercentage: number | null;
    questionAttempts: QuestionAttemptInfo[];
};

export type QuestionInfo = {
    id: string;
    questionOrder: number;
    type: QuestionType;
    questionText: string;
    imagePath: string | null;
    points: number;
    choiceOptions: ChoiceOptionInfo[];
    matchPairs: MatchPairInfo[];
    orderItems: OrderItemInfo[];
    textConfig: TextConfigInfo | null;
    flashcard: FlashcardInfo | null;
};

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MATCHING' | 'ORDERING' | 'TEXT_INPUT' | 'FLASHCARD';
export type TextReviewType = 'AUTO' | 'MANUAL';

export type ChoiceOptionInfo = {
    id: string;
    text: string;
    optionOrder: number;
};

export type MatchPairInfo = {
    id: string;
    leftSide: string;
    rightSide: string;
    pairOrder: number;
};

export type OrderItemInfo = {
    id: string;
    text: string;
};

export type TextConfigInfo = {
    review: TextReviewType;
    correctAnswer: string;
};

export type FlashcardInfo = {
    backText: string;
};



