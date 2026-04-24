export type ChoiceOption = {
    clientId: string;
    text: string;
    isCorrect: boolean;
};

export type MatchPair = {
    clientId: string;
    leftSide: string;
    rightSide: string;
};

export type OrderItem = {
    clientId: string;
    text: string;
};

export type QuestionFormBase = {
    clientId: string;
    questionText: string;
    points: number;
    imagePreviewUrl: string | null;
};

export type SingleChoiceForm = QuestionFormBase & {
    type: 'SINGLE_CHOICE';
    options: ChoiceOption[];
};

export type MultipleChoiceForm = QuestionFormBase & {
    type: 'MULTIPLE_CHOICE';
    options: ChoiceOption[];
};

export type TrueFalseForm = QuestionFormBase & {
    type: 'TRUE_FALSE';
    correctAnswer: boolean;
};

export type TextInputForm = QuestionFormBase & {
    type: 'TEXT_INPUT';
    reviewType: 'AUTOMATIC' | 'MANUAL';
    correctAnswer: string;
};

export type MatchingForm = QuestionFormBase & {
    type: 'MATCHING';
    pairs: MatchPair[];
};

export type OrderingForm = QuestionFormBase & {
    type: 'ORDERING';
    items: OrderItem[];
};

export type FlashcardForm = QuestionFormBase & {
    type: 'FLASHCARD';
    backText: string;
};

export type QuestionForm =
    | SingleChoiceForm
    | MultipleChoiceForm
    | TrueFalseForm
    | TextInputForm
    | MatchingForm
    | OrderingForm
    | FlashcardForm;

export type QuestionCreationType = QuestionForm['type'];

export const createOption = (): ChoiceOption => ({
    clientId: crypto.randomUUID(),
    text: '',
    isCorrect: false,
});

export const createPair = (): MatchPair => ({
    clientId: crypto.randomUUID(),
    leftSide: '',
    rightSide: '',
});

export const createOrderItem = (): OrderItem => ({
    clientId: crypto.randomUUID(),
    text: '',
});

export const createQuestion = (type: QuestionCreationType): QuestionForm => {
    const base: QuestionFormBase = {
        clientId: crypto.randomUUID(),
        questionText: '',
        points: 1,
        imagePreviewUrl: null,
    };
    switch (type) {
        case 'SINGLE_CHOICE':
            return { ...base, type, options: [createOption(), createOption()] };
        case 'MULTIPLE_CHOICE':
            return { ...base, type, options: [createOption(), createOption()] };
        case 'TRUE_FALSE':
            return { ...base, type, correctAnswer: true };
        case 'TEXT_INPUT':
            return { ...base, type, reviewType: 'AUTOMATIC', correctAnswer: '' };
        case 'MATCHING':
            return { ...base, type, pairs: [createPair(), createPair()] };
        case 'ORDERING':
            return { ...base, type, items: [createOrderItem(), createOrderItem()] };
        case 'FLASHCARD':
            return { ...base, type, backText: '' };
    }
};
