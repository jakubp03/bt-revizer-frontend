import { Button } from '@/components/ui/shadcn_ui/button';
import { Card, CardContent } from '@/components/ui/shadcn_ui/card';
import { useAppSelector } from '@/store/hooks';
import {
    AlarmClock,
    AlarmClockOff,
    ChartNoAxesColumn,
    Play,
    Star
} from 'lucide-react';

export default function QuizStartView({ onStart }: { onStart: () => void }) {
    const { selectedQuiz } = useAppSelector((state) => state.quiz);
    if (!selectedQuiz) return null;

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center gap-6 pt-6">
                    <span className="text-4xl">{selectedQuiz.icon || '📝'}</span>
                    <h1 className="text-2xl font-bold text-foreground">{selectedQuiz.title}</h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <ChartNoAxesColumn size={16} className="text-primary" />
                            <span>{selectedQuiz.questionCount} {selectedQuiz.questionCount === 1 ? 'question' : 'questions'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Star size={16} className="text-primary" />
                            <span>{selectedQuiz.totalPoints} points</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {selectedQuiz.timeLimit ? (
                                <>
                                    <AlarmClock size={16} className="text-primary" />
                                    <span>{selectedQuiz.timeLimit}s</span>
                                </>
                            ) : (
                                <>
                                    <AlarmClockOff size={16} className="text-muted-foreground" />
                                    <span>No time limit</span>
                                </>
                            )}
                        </div>
                    </div>

                    <Button className="mt-2 gap-2" size="lg" onClick={onStart}>
                        <Play size={18} fill="currentColor" />
                        Start
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
