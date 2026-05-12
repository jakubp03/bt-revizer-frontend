import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearQuizStats, clearSelectedQuiz } from "@/store/slices/quizSlice";
import { fetchQuizById, fetchQuizStats } from "@/store/thunks/quizThunks";
import {
    AlarmClock,
    AlarmClockOff,
    Calendar,
    ChartNoAxesColumn,
    History,
    Lightbulb,
    Play,
    RotateCcw,
    Star,
    TrendingUp
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../shadcn_ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../shadcn_ui/chart";
import { Separator } from "../../shadcn_ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn_ui/tabs";
import CategoryBadge from "../../shared/CategoryBadge";
import LoadingSpinner from "../../shared/LoadingSpinner";

export default function QuizDetailView() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { selectedQuiz, isLoadingSelected, selectedQuizStats } = useAppSelector((state) => state.quiz);

    useEffect(() => {
        if (!id) {
            return;
        }

        if (id !== selectedQuiz?.id) {
            dispatch(clearSelectedQuiz());
            dispatch(fetchQuizById(id));
        }

        dispatch(fetchQuizStats(id));

        return () => {
            dispatch(clearQuizStats());
        };
    }, [id, dispatch]);

    const averageScorePercentage = useMemo(() => {
        if (!selectedQuizStats || selectedQuizStats.scorePercentages.length === 0) return null;
        const sum = selectedQuizStats.scorePercentages.reduce((acc, v) => acc + v, 0);
        return sum / selectedQuizStats.scorePercentages.length;
    }, [selectedQuizStats]);

    const attemptCount = selectedQuizStats?.scorePercentages.length ?? null;

    const scoreOverAttemptsData = useMemo(() => {
        if (!selectedQuizStats) return [];
        return selectedQuizStats.scorePercentages.map((score, i) => ({
            attempt: i + 1,
            score: Math.round(score * 10) / 10,
        }));
    }, [selectedQuizStats]);

    const timeOverAttemptsData = useMemo(() => {
        if (!selectedQuizStats) return [];
        return selectedQuizStats.attemptTimes.map((time, i) => ({
            attempt: i + 1,
            time,
        }));
    }, [selectedQuizStats]);

    const errorRateData = useMemo(() => {
        if (!selectedQuizStats) return [];
        return selectedQuizStats.questionAttempts.map((q, i) => ({
            question: `Q${i + 1}`,
            rate: Math.round(q.averageQuestionScorePercentage * 10) / 10,
        }));
    }, [selectedQuizStats]);

    const timePerQuestionData = useMemo(() => {
        if (!selectedQuizStats) return [];
        return selectedQuizStats.questionAttempts
            .filter((q) => q.averageQuestionAttemptTime != null)
            .map((q, i) => ({
                question: `Q${i + 1}`,
                time: q.averageQuestionAttemptTime as number,
            }));
    }, [selectedQuizStats]);

    if (isLoadingSelected || !selectedQuiz) {
        return <LoadingSpinner />;
    }

    const formattedCreatedAt = new Date(selectedQuiz.createdAt).toLocaleDateString();
    const formattedUpdatedAt = new Date(selectedQuiz.updatedAt).toLocaleDateString();

    const hasAttempts = attemptCount !== null && attemptCount > 0;

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

            {/* Quiz Info Card */}
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

                        {attemptCount !== null && (
                            <div className="flex items-center gap-2 text-sm">
                                <RotateCcw size={16} className="text-primary" />
                                <span className="text-muted-foreground">Attempts:</span>
                                <span className="font-medium">{attemptCount}</span>
                            </div>
                        )}

                        {selectedQuizStats?.previousAttemptScorePercentage != null && (
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp size={16} className="text-primary" />
                                <span className="text-muted-foreground">Last attempt:</span>
                                <span className="font-medium">
                                    {Math.round(selectedQuizStats.previousAttemptScorePercentage)}%
                                </span>
                            </div>
                        )}

                        {averageScorePercentage !== null && (
                            <div className="flex items-center gap-2 text-sm">
                                <ChartNoAxesColumn size={16} className="text-primary" />
                                <span className="text-muted-foreground">Average:</span>
                                <span className="font-medium">
                                    {Math.round(averageScorePercentage)}%
                                </span>
                            </div>
                        )}
                    </div>

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

            {/* Tabs */}
            <Tabs defaultValue="attempts">
                <TabsList>
                    <TabsTrigger value="attempts" className="flex items-center gap-1.5">
                        <History size={14} />
                        Previous Attempts
                    </TabsTrigger>
                    <TabsTrigger value="graphs" className="flex items-center gap-1.5">
                        <ChartNoAxesColumn size={14} />
                        Graphs
                    </TabsTrigger>
                </TabsList>

                {/* Previous Attempts Tab */}
                <TabsContent value="attempts">
                    <Card>
                        <CardContent className="py-6">
                            <p className="text-sm text-muted-foreground">No attempts yet</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Graphs Tab */}
                <TabsContent value="graphs">
                    <Tabs defaultValue="score-progress">
                        <TabsList className="mb-4">
                            <TabsTrigger value="score-progress">Score Progress</TabsTrigger>
                            <TabsTrigger value="time-progress">Time Progress</TabsTrigger>
                            <TabsTrigger value="error-rate">Error Rate</TabsTrigger>
                            <TabsTrigger value="time-per-question">Time per Question</TabsTrigger>
                        </TabsList>

                        {/* Score over attempts */}
                        <TabsContent value="score-progress">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Score % per Attempt
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!hasAttempts || scoreOverAttemptsData.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Insufficient data</p>
                                    ) : (
                                        <ChartContainer config={{ score: { label: "Score %", color: "var(--color-primary)" } }}>
                                            <LineChart data={scoreOverAttemptsData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="attempt" label={{ value: "Attempt", position: "insideBottom", offset: -2 }} />
                                                <YAxis domain={[0, 100]} unit="%" />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Line type="monotone" dataKey="score" name="Score %" stroke="var(--color-primary)" strokeWidth={2} dot />
                                            </LineChart>
                                        </ChartContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Time over attempts */}
                        <TabsContent value="time-progress">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Time Spent per Attempt
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!hasAttempts || timeOverAttemptsData.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Insufficient data</p>
                                    ) : (
                                        <ChartContainer config={{ time: { label: "Time (s)", color: "var(--color-primary)" } }}>
                                            <LineChart data={timeOverAttemptsData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="attempt" label={{ value: "Attempt", position: "insideBottom", offset: -2 }} />
                                                <YAxis unit="s" />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Line type="monotone" dataKey="time" name="Time (s)" stroke="var(--color-primary)" strokeWidth={2} dot />
                                            </LineChart>
                                        </ChartContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Error rate per question */}
                        <TabsContent value="error-rate">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Average Score % per Question
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!hasAttempts || errorRateData.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Insufficient data</p>
                                    ) : (
                                        <ChartContainer config={{ rate: { label: "Score %", color: "var(--color-primary)" } }}>
                                            <BarChart data={errorRateData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="question" />
                                                <YAxis domain={[0, 100]} unit="%" />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Bar dataKey="rate" name="Score %" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ChartContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Time per question */}
                        <TabsContent value="time-per-question">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Average Time per Question
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!hasAttempts || timePerQuestionData.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Insufficient data</p>
                                    ) : (
                                        <ChartContainer config={{ time: { label: "Time (s)", color: "var(--color-primary)" } }}>
                                            <BarChart data={timePerQuestionData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="question" />
                                                <YAxis unit="s" />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Bar dataKey="time" name="Time (s)" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ChartContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
}

