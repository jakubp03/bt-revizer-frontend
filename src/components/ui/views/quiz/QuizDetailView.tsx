import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearSelectedQuiz } from "@/store/slices/quizSlice";
import { fetchQuizById } from "@/store/thunks/quizThunks";
import {
    AlarmClock,
    AlarmClockOff,
    Calendar,
    ChartNoAxesColumn,
    Lightbulb,
    Play,
    Star,
    TrendingUp
} from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../shadcn_ui/card";
import { Separator } from "../../shadcn_ui/separator";
import LoadingSpinner from "../../shared/LoadingSpinner";
import CategoryBadge from "../library/CategoryBadge";

export default function QuizDetailView() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { selectedQuiz, isLoadingSelected } = useAppSelector((state) => state.quiz);

    useEffect(() => {
        if (id) {
            dispatch(fetchQuizById(id));
        }
        return () => {
            dispatch(clearSelectedQuiz());
        };
    }, [id, dispatch]);

    if (isLoadingSelected || !selectedQuiz) {
        return (
            <LoadingSpinner />
        );
    }

    const formattedCreatedAt = new Date(selectedQuiz.createdAt).toLocaleDateString();
    const formattedUpdatedAt = new Date(selectedQuiz.updatedAt).toLocaleDateString();

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">
                        {selectedQuiz.icon || <Lightbulb size={32} className="text-muted-foreground" />}
                    </span>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{selectedQuiz.title}</h1>
                        {selectedQuiz.description && (
                            <p className="mt-1 text-sm text-muted-foreground">{selectedQuiz.description}</p>
                        )}
                    </div>
                </div>
                <Link
                    to={`/quiz/${selectedQuiz.id}/play`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:cursor-pointer"
                >
                    <Play size={20} fill="currentColor" />
                </Link>
            </div>

            {/* Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Quiz Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        <div className="flex items-center gap-2 text-sm">
                            <ChartNoAxesColumn size={16} className="text-primary" />
                            <span className="text-muted-foreground">Questions:</span>
                            <span className="font-medium">{selectedQuiz.questionCount}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Star size={16} className="text-primary" />
                            <span className="text-muted-foreground">Total points:</span>
                            <span className="font-medium">{selectedQuiz.totalPoints}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            {selectedQuiz.timeLimit ? (
                                <AlarmClock size={16} className="text-primary" />
                            ) : (
                                <AlarmClockOff size={16} className="text-muted-foreground" />
                            )}
                            <span className="text-muted-foreground">Time limit:</span>
                            <span className="font-medium">
                                {selectedQuiz.timeLimit ? `${selectedQuiz.timeLimit}s` : "None"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Calendar size={16} className="text-primary" />
                            <span className="text-muted-foreground">Created:</span>
                            <span className="font-medium">{formattedCreatedAt}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Calendar size={16} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Updated:</span>
                            <span className="font-medium">{formattedUpdatedAt}</span>
                        </div>

                        {selectedQuiz.previousAttemptScorePercentage != null && (
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp size={16} className="text-primary" />
                                <span className="text-muted-foreground">Last attempt:</span>
                                <span className="font-medium">
                                    {Math.round(selectedQuiz.previousAttemptScorePercentage)}%
                                </span>
                            </div>
                        )}

                        {selectedQuiz.averageScorePercentage != null && (
                            <div className="flex items-center gap-2 text-sm">
                                <ChartNoAxesColumn size={16} className="text-primary" />
                                <span className="text-muted-foreground">Average:</span>
                                <span className="font-medium">
                                    {Math.round(selectedQuiz.averageScorePercentage)}%
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Categories */}
                    {selectedQuiz.categories.length > 0 && (
                        <>
                            <Separator className="my-4" />
                            <div className="flex flex-wrap gap-1.5">
                                {selectedQuiz.categories.map((cat) => (
                                    <CategoryBadge key={cat.id} categoryId={cat.id} />
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Previous Attempts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Previous Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No attempts yet</p>
                </CardContent>
            </Card>
        </div>
    );
}
