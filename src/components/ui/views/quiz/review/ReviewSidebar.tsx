import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setReviewIndex } from '@/store/slices/attemptReviewSlice';
import type { QuestionReview } from '@/types/quiz';
import { Check, Circle, LayoutDashboard, X } from 'lucide-react';
import { Separator } from '../../../shadcn_ui/separator';

function getStatus(q: QuestionReview): 'correct' | 'partial' | 'incorrect' {
    if (q.scorePercentage >= 100) return 'correct';
    if (q.scorePercentage > 0) return 'partial';
    return 'incorrect';
}

function QuestionItem({ question, index }: { question: QuestionReview; index: number }) {
    const dispatch = useAppDispatch();
    const currentIndex = useAppSelector((s) => s.attemptReview.currentIndex);
    const isActive = currentIndex === index;
    const status = getStatus(question);

    return (
        <button
            type="button"
            onClick={() => dispatch(setReviewIndex(index))}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50 text-foreground'}`}
        >
            <span className="flex-shrink-0">
                {status === 'correct' && <Check size={16} className="text-green-500" />}
                {status === 'partial' && <Circle size={16} className="text-yellow-500" />}
                {status === 'incorrect' && <X size={16} className="text-red-500" />}
            </span>
            <span className="truncate">Q{question.questionOrder}</span>
        </button>
    );
}

export default function ReviewSidebar({ questions }: { questions: QuestionReview[] }) {
    const dispatch = useAppDispatch();
    const currentIndex = useAppSelector((s) => s.attemptReview.currentIndex);
    const isOverviewActive = currentIndex === -1;

    return (
        <aside className="flex h-full w-56 flex-col border-r bg-background">
            <div className="p-2">
                <button
                    type="button"
                    onClick={() => dispatch(setReviewIndex(-1))}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${isOverviewActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50 text-foreground'}`}
                >
                    <LayoutDashboard size={16} className="flex-shrink-0" />
                    <span>Overview</span>
                </button>
            </div>
            <Separator />
            <div className="border-b px-4 py-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Questions
                </h3>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
                {questions.map((q, i) => (
                    <QuestionItem key={q.questionId} question={q} index={i} />
                ))}
            </nav>
        </aside>
    );
}
