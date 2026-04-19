import type { QuestionInfo } from '@/types/quiz';
import FlashcardQuestion from './FlashcardQuestion';
import MatchingQuestion from './MatchingQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import OrderingQuestion from './OrderingQuestion';
import SingleChoiceQuestion from './SingleChoiceQuestion';
import TextInputQuestion from './TextInputQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';

export default function QuestionRenderer({ question }: { question: QuestionInfo }) {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-xs text-muted-foreground">
                    Question {question.questionOrder} &middot; {question.points} {question.points === 1 ? 'point' : 'points'}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{question.questionText}</h2>
                {question.imagePath && (
                    <img
                        src={question.imagePath}
                        alt="Question"
                        className="mt-3 max-h-64 rounded-lg object-contain"
                    />
                )}
            </div>

            {question.type === 'SINGLE_CHOICE' && <SingleChoiceQuestion question={question} />}
            {question.type === 'MULTIPLE_CHOICE' && <MultipleChoiceQuestion question={question} />}
            {question.type === 'TRUE_FALSE' && <TrueFalseQuestion question={question} />}
            {question.type === 'TEXT_INPUT' && <TextInputQuestion question={question} />}
            {question.type === 'MATCHING' && <MatchingQuestion question={question} />}
            {question.type === 'ORDERING' && <OrderingQuestion question={question} />}
            {question.type === 'FLASHCARD' && <FlashcardQuestion question={question} />}
        </div>
    );
}
