import type {
    ChoiceOptionReview,
    FlashcardAnswerReview,
    MatchPairReview,
    OrderItemReview,
    QuestionReview,
    TextAnswerReview,
} from '@/types/quiz';
import { Check, X } from 'lucide-react';

// ─── Shared ──────────────────────────────────────────────────────────────────

function getQuestionStatus(q: QuestionReview): 'correct' | 'partial' | 'incorrect' {
    if (q.scorePercentage >= 100) return 'correct';
    if (q.scorePercentage > 0) return 'partial';
    return 'incorrect';
}

function StatusLabel({ status }: { status: 'correct' | 'partial' | 'incorrect' }) {
    if (status === 'correct') return <span className="text-sm font-medium text-green-600 dark:text-green-400">correct</span>;
    if (status === 'partial') return <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">partially correct</span>;
    return <span className="text-sm font-medium text-red-600 dark:text-red-400">incorrect</span>;
}

// ─── Choice (single / multiple / true_false) ─────────────────────────────────

function ChoiceOptionRow({
    opt,
    inputType,
    questionId,
}: {
    opt: ChoiceOptionReview;
    inputType: 'radio' | 'checkbox';
    questionId: string;
}) {
    const borderCls = opt.selected
        ? opt.correct
            ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
            : 'border-red-500 bg-red-50 dark:bg-red-950/30'
        : 'border-border';
    const textCls = opt.correct
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-600 dark:text-red-400';

    return (
        <div className="flex items-center gap-3">
            <input
                type={inputType}
                name={`review-q-${questionId}`}
                checked={opt.selected}
                disabled
                readOnly
                className="accent-primary shrink-0"
            />
            <div className={`w-[28rem] rounded-lg border px-3 py-2.5 ${borderCls}`}>
                <span className={`text-sm font-medium wrap-break-word ${textCls}`}>{opt.text}</span>
            </div>
            <div className="flex items-center gap-2">
                {opt.correct
                    ? <Check size={16} className="text-green-500 shrink-0" />
                    : <X size={16} className="text-red-500 shrink-0" />
                }
                {opt.selected && (
                    <span className="text-xs font-medium text-blue-500 whitespace-nowrap">(your answer)</span>
                )}
            </div>
        </div>
    );
}

function ChoiceReviewQuestion({
    question,
    inputType,
}: {
    question: QuestionReview;
    inputType: 'radio' | 'checkbox';
}) {
    const sorted = [...(question.choiceOptions ?? [])].sort((a, b) => a.optionOrder - b.optionOrder);
    const status = getQuestionStatus(question);
    return (
        <div className="flex flex-col gap-4">
            <StatusLabel status={status} />
            <div className="flex flex-col gap-3">
                {sorted.map((opt) => (
                    <ChoiceOptionRow
                        key={opt.id}
                        opt={opt}
                        inputType={inputType}
                        questionId={question.questionId}
                    />
                ))}
            </div>
        </div>
    );
}

// ─── Text Input ───────────────────────────────────────────────────────────────

function TextReviewQuestion({ textAnswer }: { textAnswer: TextAnswerReview }) {
    const isCorrect = textAnswer.scorePercentage >= 100;
    const borderCls = isCorrect
        ? 'border-green-500 text-green-700 dark:text-green-400 dark:bg-green-950/30'
        : 'border-red-500 text-red-600 dark:text-red-400 dark:bg-red-950/30';
    const reviewLabel = textAnswer.reviewType === 'MANUAL' ? 'manual review' : 'automatic review';

    return (
        <div className="flex flex-col gap-4">
            {textAnswer.correctAnswer && (
                <p className="text-sm">
                    <span className="text-muted-foreground">Correct answer: </span>
                    {textAnswer.correctAnswer}
                </p>
            )}
            <span className={`text-sm font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isCorrect ? 'correct' : 'incorrect'}
            </span>
            <div className="flex flex-col gap-1.5">
                <span className="text-sm text-blue-500">your answer:</span>
                <div className={`rounded-lg border-2 p-3 ${borderCls}`}>
                    <p className="text-sm">{textAnswer.userAnswer || '(no answer)'}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{reviewLabel}</span>
            </div>
        </div>
    );
}

// ─── Matching ─────────────────────────────────────────────────────────────────

function MatchReviewQuestion({
    question,
    pairs,
}: {
    question: QuestionReview;
    pairs: MatchPairReview[];
}) {
    const status = getQuestionStatus(question);
    return (
        <div className="flex flex-col gap-4">
            <StatusLabel status={status} />
            <div className="flex flex-col gap-3">
                {pairs.map((pair) => {
                    const rightBorderCls = pair.correct ? 'border-green-500 dark:bg-green-950/30' : 'border-red-500 dark:bg-red-950/30';
                    const rightTextCls = pair.correct
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400';
                    return (
                        <div key={pair.id} className="flex items-center gap-3">
                            <div className="w-[28rem] rounded-lg border border-border px-3 py-2.5">
                                <span className="text-sm text-muted-foreground wrap-break-word">
                                    {pair.leftSide}
                                </span>
                            </div>
                            <div className={`w-[28rem] rounded-lg border px-3 py-2.5 ${rightBorderCls}`}>
                                <span className={`text-sm font-medium wrap-break-word ${rightTextCls}`}>
                                    {pair.userRightSide}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {pair.correct
                                    ? <Check size={16} className="text-green-500 shrink-0" />
                                    : <X size={16} className="text-red-500 shrink-0" />
                                }
                                <span className="text-xs font-medium text-blue-500 whitespace-nowrap">(your answer)</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Ordering ─────────────────────────────────────────────────────────────────

function OrderReviewQuestion({
    question,
    items,
}: {
    question: QuestionReview;
    items: OrderItemReview[];
}) {
    const sorted = [...items].sort((a, b) => a.userPosition - b.userPosition);
    const status = getQuestionStatus(question);
    return (
        <div className="flex flex-col gap-4">
            <StatusLabel status={status} />
            <div className="flex flex-col gap-3">
                {sorted.map((item) => {
                    const borderCls = item.correct ? 'border-green-500 dark:bg-green-950/30' : 'border-red-500 dark:bg-red-950/30';
                    const textCls = item.correct
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400';
                    return (
                        <div key={item.id} className="flex items-center gap-3">
                            <div className={`w-72 rounded-lg border px-3 py-2.5 ${borderCls}`}>
                                <span className={`text-sm font-medium wrap-break-word ${textCls}`}>{item.text}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.correct
                                    ? <Check size={16} className="text-green-500 shrink-0" />
                                    : <X size={16} className="text-red-500 shrink-0" />
                                }
                                <span className="text-xs font-medium text-blue-500 whitespace-nowrap">(your answer)</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Flashcard ────────────────────────────────────────────────────────────────

function FlashcardReviewQuestion({
    question,
    flashcard,
}: {
    question: QuestionReview;
    flashcard: FlashcardAnswerReview;
}) {
    return (
        <div className="flex flex-col items-center gap-4">
            <span className={`text-sm font-medium ${flashcard.markedCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {flashcard.markedCorrect ? 'marked as recalled' : 'marked as not recalled'}
            </span>
            <div className="flex w-full max-w-2xl gap-4">
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center shadow-sm">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Front side
                    </p>
                    <p className="text-base">{question.questionText}</p>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center shadow-sm">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Back side
                    </p>
                    <p className="text-base">{flashcard.backText}</p>
                </div>
            </div>
        </div>
    );
}

// ─── Main renderer ────────────────────────────────────────────────────────────

export default function ReviewQuestionRenderer({ question }: { question: QuestionReview }) {
    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                        Question {question.questionOrder} &middot; {Math.round(question.pointsAwarded * 10) / 10}/{question.points} {question.points === 1 ? 'point' : 'points'}
                    </p>
                </div>
                {question.type !== 'FLASHCARD' && (
                    <h2 className="mt-1 text-lg font-semibold">{question.questionText}</h2>
                )}
                {question.imagePath && (
                    <img
                        src={question.imagePath}
                        alt="Question"
                        className="mt-3 max-h-64 rounded-lg object-contain"
                    />
                )}
            </div>

            {/* Type-specific content */}
            {(question.type === 'SINGLE_CHOICE' || question.type === 'TRUE_FALSE') && (
                <ChoiceReviewQuestion question={question} inputType="radio" />
            )}
            {question.type === 'MULTIPLE_CHOICE' && (
                <ChoiceReviewQuestion question={question} inputType="checkbox" />
            )}
            {question.type === 'TEXT_INPUT' && question.textAnswer && (
                <TextReviewQuestion textAnswer={question.textAnswer} />
            )}
            {question.type === 'MATCHING' && question.matchPairs && (
                <MatchReviewQuestion question={question} pairs={question.matchPairs} />
            )}
            {question.type === 'ORDERING' && question.orderItems && (
                <OrderReviewQuestion question={question} items={question.orderItems} />
            )}
            {question.type === 'FLASHCARD' && question.flashcard && (
                <FlashcardReviewQuestion question={question} flashcard={question.flashcard} />
            )}
        </div>
    );
}
