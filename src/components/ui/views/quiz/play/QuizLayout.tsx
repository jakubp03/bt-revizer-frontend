import type { QuestionInfo } from '@/types/quiz';
import QuizSidebar from './QuizSidebar';
import QuizTopBar from './QuizTopBar';


type Props = {
    questions: QuestionInfo[];
    timeLimit: number | null;
    onSubmit: () => void;
    onTimeUp: () => void;
    children: React.ReactNode;
};

export default function QuizLayout({ questions, timeLimit, onSubmit, onTimeUp, children }: Props) {
    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <QuizTopBar
                questions={questions}
                timeLimit={timeLimit}
                onSubmit={onSubmit}
                onTimeUp={onTimeUp}
            />
            <div className="flex flex-1 overflow-hidden">
                <QuizSidebar questions={questions} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
