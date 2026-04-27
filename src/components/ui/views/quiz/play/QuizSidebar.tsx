import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAnswerState, setCurrentQuestionIndex } from '@/store/slices/quizPlaySlice';
import type { QuestionInfo } from '@/types/quiz';
import { Check, Circle, CircleDot } from 'lucide-react';

function QuestionItem({ question, index }: { question: QuestionInfo; index: number }) {
    const dispatch = useAppDispatch();
    const currentIndex = useAppSelector((s) => s.quizPlay.currentQuestionIndex);
    const answerState = useAppSelector(selectAnswerState(question));
    const isActive = currentIndex === index;

    return (
        <button
            type="button"
            onClick={() => dispatch(setCurrentQuestionIndex(index))}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50 text-foreground'}`}
        >
            <span className="flex-shrink-0">
                {answerState === 'answered' && (
                    <Check size={16} className="text-green-500" />
                )}
                {answerState === 'partial' && (
                    <CircleDot size={16} className="text-yellow-500" />
                )}
                {answerState === 'unanswered' && (
                    <Circle size={16} className="text-muted-foreground" />
                )}
            </span>
            <span className="truncate">Q{question.questionOrder}</span>
        </button>
    );
}

export default function QuizSidebar({ questions }: { questions: QuestionInfo[] }) {
    return (
        <aside className="flex h-full w-56 flex-col border-r bg-background">
            <div className="border-b px-4 py-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Questions
                </h3>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
                {questions.map((q, i) => (
                    <QuestionItem key={q.id} question={q} index={i} />
                ))}
            </nav>
        </aside>
    );
}
