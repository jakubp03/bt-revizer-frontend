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
    minQuestionAttemptTime: number | null;
    q1QuestionAttemptTime: number | null;
    medQuestionAttemptTime: number | null;
    q3QuestionAttemptTime: number | null;
    maxQuestionAttemptTime: number | null;
    outliers: number[] | null;
    medQuestionScorePercentage: number;
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

export type AttemptBasicResponse = {
    id: string;
    submittedAt: string;
    scorePercentage: number;
    timeSpent: number;
};

export type AttemptSummaryResponse = {
    id: string;
    submittedAt: string;
    scorePercentage: number;
    timeSpent: number;
    quizId: string;
    quizTitle: string;
};

export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
};

export type ChoiceOptionReview = {
    id: string;
    text: string;
    optionOrder: number;
    correct: boolean;
    selected: boolean;
};

export type MatchPairReview = {
    id: string;
    leftSide: string;
    correctRightSide: string;
    userRightId: string;
    userRightSide: string;
    correct: boolean;
};

export type OrderItemReview = {
    id: string;
    text: string;
    correctPosition: number;
    userPosition: number;
    correct: boolean;
};

export type TextAnswerReview = {
    reviewType: string;
    correctAnswer: string | null;
    userAnswer: string;
    scorePercentage: number;
};

export type FlashcardAnswerReview = {
    backText: string;
    markedCorrect: boolean;
};

export type QuestionReview = {
    questionId: string;
    questionOrder: number;
    type: QuestionType;
    questionText: string;
    imagePath: string | null;
    points: number;
    pointsAwarded: number;
    scorePercentage: number;
    choiceOptions: ChoiceOptionReview[] | null;
    matchPairs: MatchPairReview[] | null;
    orderItems: OrderItemReview[] | null;
    textAnswer: TextAnswerReview | null;
    flashcard: FlashcardAnswerReview | null;
};

export type AttemptReviewResponse = {
    attemptId: string;
    quizId: string;
    quizTitle: string;
    scorePercentage: number;
    score: number;
    maxScore: number;
    timeSpent: number | null;
    submittedAt: string;
    questions: QuestionReview[];
};



