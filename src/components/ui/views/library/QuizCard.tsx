import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn_ui/card";
import type { Quiz } from "@/types/quiz";
import { AlarmClock, AlarmClockOff, Lightbulb, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CategoryBadge from "./CategoryBadge";

export default function QuizCard({ quiz }: { quiz: Quiz }) {
    const navigate = useNavigate();

    return (
        <Card
            className="cursor-pointer transition-all hover:shadow-md hover:ring-primary/40"
            onClick={() => navigate(`/quiz/${quiz.id}`)}
        >
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">
                            {quiz.icon || <Lightbulb size={24} className="text-muted-foreground" />}
                        </span>
                        <CardTitle className="text-base font-semibold">
                            {quiz.title}
                        </CardTitle>
                    </div>
                    <Link
                        to={`/quiz/${quiz.id}/play`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                        <Play size={16} fill="currentColor" />
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5" title={quiz.timeLimit ? "Time limit" : "No time limit"}>
                        {quiz.timeLimit ? (
                            <AlarmClock size={16} className="text-primary" />
                        ) : (
                            <AlarmClockOff size={16} className="text-muted-foreground" />
                        )}
                    </span>
                    <span>{quiz.questionCount} {quiz.questionCount === 1 ? "question" : "questions"}</span>
                </div>

                {quiz.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {quiz.categories.map((cat) => (
                            <CategoryBadge key={cat.id} categoryId={cat.id} />
                        ))}
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground">No tags</span>
                )}
            </CardContent>
        </Card>
    );
}
