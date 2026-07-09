import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearQuizAttempts, clearQuizStats, clearSelectedQuiz } from "@/store/slices/quizSlice";
import { fetchQuizAttempts, fetchQuizById, fetchQuizStats } from "@/store/thunks/quizThunks";
import { formatDuration } from "@/utils/timeUtils";
import ReactECharts from "echarts-for-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "../../shadcn_ui/card";
import { Separator } from "../../shadcn_ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn_ui/tabs";
import BackButton from "../../shared/BackButton";
import CategoryBadge from "../../shared/CategoryBadge";
import LoadingSpinner from "../../shared/LoadingSpinner";

export default function QuizDetailView() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { selectedQuiz, isLoadingSelected, selectedQuizStats, selectedQuizAttempts } = useAppSelector((state) => state.quiz);

    useEffect(() => {
        if (!id) {
            return;
        }

        if (id !== selectedQuiz?.id) {
            dispatch(clearSelectedQuiz());
            dispatch(fetchQuizById(id));
        }

        dispatch(fetchQuizStats(id));
        dispatch(fetchQuizAttempts(id));

        return () => {
            dispatch(clearQuizStats());
            dispatch(clearQuizAttempts());
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
            avg: q.avgQuestionScorePercentage
        }));
    }, [selectedQuizStats]);

    const timePerQuestionData = useMemo(() => {
        if (!selectedQuizStats) return [];
        return selectedQuizStats.questionAttempts
            .filter((q) => q != null
                && q.minQuestionAttemptTime !== null
                && q.q1QuestionAttemptTime !== null
                && q.medQuestionAttemptTime !== null
                && q.q3QuestionAttemptTime !== null
                && q.maxQuestionAttemptTime !== null
            )
            .map((q, i) => ({
                question: `Q${i + 1}`,
                min: q.minQuestionAttemptTime!,
                q1: q.q1QuestionAttemptTime!,
                med: q.medQuestionAttemptTime!,
                q3: q.q3QuestionAttemptTime!,
                max: q.maxQuestionAttemptTime!,
                outliers: q.outliers!
            }));
    }, [selectedQuizStats]);

    const primaryColor = useMemo(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6366f1';
    }, []);

    if (isLoadingSelected || !selectedQuiz) {
        return <LoadingSpinner />;
    }

    const formattedCreatedAt = new Date(selectedQuiz.createdAt).toLocaleDateString();

    const hasAttempts = attemptCount !== null && attemptCount > 0;

    console.log(timePerQuestionData.length);

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <BackButton />
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
                    <CardTitle className="text-sm font-medium text-foreground">Quiz Info</CardTitle>
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
                                <AlarmClockOff size={16} className="text-primary" />
                            )}
                            <span className="text-muted-foreground">Time limit:</span>
                            <span className="font-medium">
                                {selectedQuiz.timeLimit ? formatDuration(selectedQuiz.timeLimit) : "None"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Calendar size={16} className="text-primary" />
                            <span className="text-muted-foreground">Created:</span>
                            <span className="font-medium">{formattedCreatedAt}</span>
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
                            {!selectedQuizAttempts || selectedQuizAttempts.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No attempts yet</p>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between px-4 pb-2 text-xs font-medium text-muted-foreground border-b">
                                        <span>Attempt</span>
                                        <div className="flex items-center gap-8">
                                            <span>Date</span>
                                            <span>Score</span>
                                        </div>
                                    </div>
                                    <ul className="flex flex-col">
                                        {selectedQuizAttempts.map((attempt, index) => (
                                            <li key={attempt.id}>
                                                <Link
                                                    to={`/quiz/${selectedQuiz.id}/review/${attempt.id}`}
                                                    className="flex items-center justify-between rounded-md px-4 py-3 text-sm transition-colors hover:bg-muted"
                                                >
                                                    <span className="font-medium">Attempt #{selectedQuizAttempts.length - index}</span>
                                                    <div className="flex items-center gap-8">
                                                        <span className="text-muted-foreground">
                                                            {new Date(attempt.submittedAt).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="font-medium w-10 text-right">
                                                            {Math.round(attempt.scorePercentage)}%
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
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
                                        <ReactECharts
                                            style={{ height: '384px' }}
                                            option={{
                                                grid: { top: 16, right: 16, bottom: 40, left: 55 },
                                                xAxis: {
                                                    type: 'category',
                                                    data: scoreOverAttemptsData.map(d => d.attempt),
                                                    name: 'Attempt',
                                                    nameLocation: 'middle',
                                                    nameGap: 25,
                                                },
                                                yAxis: {
                                                    type: 'value',
                                                    min: 0,
                                                    max: 100,
                                                    axisLabel: { formatter: '{value}%' },
                                                },
                                                tooltip: {
                                                    trigger: 'axis',
                                                    formatter: (params: any[]) =>
                                                        `Attempt ${params[0].name}<br/>Score: ${params[0].value}%`,
                                                },
                                                series: [{
                                                    type: 'bar',
                                                    data: scoreOverAttemptsData.map(d => d.score),
                                                    name: 'Score %',
                                                    itemStyle: { color: primaryColor, borderRadius: [4, 4, 0, 0] },
                                                    emphasis: { itemStyle: { color: primaryColor, borderRadius: [4, 4, 0, 0] } },
                                                }],
                                            }}
                                        />
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
                                        <ReactECharts
                                            style={{ height: '384px' }}
                                            option={{
                                                grid: { top: 16, right: 16, bottom: 40, left: 55 },
                                                xAxis: {
                                                    type: 'category',
                                                    data: timeOverAttemptsData.map(d => d.attempt),
                                                    name: 'Attempt',
                                                    nameLocation: 'middle',
                                                    nameGap: 25,
                                                },
                                                yAxis: {
                                                    type: 'value',
                                                    axisLabel: { formatter: '{value}s' },
                                                },
                                                tooltip: {
                                                    trigger: 'axis',
                                                    formatter: (params: any[]) =>
                                                        `Attempt ${params[0].name}<br/>Time: ${params[0].value}s`,
                                                },
                                                series: [{
                                                    type: 'bar',
                                                    data: timeOverAttemptsData.map(d => d.time),
                                                    name: 'Time (s)',
                                                    itemStyle: { color: primaryColor, borderRadius: [4, 4, 0, 0] },
                                                    emphasis: { itemStyle: { color: primaryColor, borderRadius: [4, 4, 0, 0] } },
                                                }],
                                            }}
                                        />
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
                                        <ReactECharts
                                            style={{ height: '384px' }}
                                            option={{
                                                grid: { top: 16, right: 16, bottom: 30, left: 55 },
                                                xAxis: {
                                                    type: 'category',
                                                    data: errorRateData.map(d => d.question),
                                                },
                                                yAxis: {
                                                    type: 'value',
                                                    min: 0,
                                                    max: 100,
                                                    axisLabel: { formatter: '{value}%' },
                                                },
                                                tooltip: {
                                                    trigger: 'axis',
                                                    formatter: (params: any[]) =>
                                                        `${params[0].name}<br/>Average Score: ${params[0].value}%`,
                                                },
                                                series: [{
                                                    type: 'bar',
                                                    data: errorRateData.map(d => d.avg),
                                                    name: 'Score %',
                                                    itemStyle: { color: primaryColor, borderRadius: [4, 4, 0, 0] },
                                                    emphasis: { itemStyle: { color: primaryColor, borderRadius: [4, 4, 0, 0] } },
                                                }],
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Time per question */}
                        <TabsContent value="time-per-question">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Time per Question (Box Plot)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!hasAttempts || attemptCount < 5 ? (
                                        <p className="text-sm text-muted-foreground">Insufficient data</p>
                                    ) : (
                                        <ReactECharts
                                            style={{ height: '384px' }}
                                            option={{
                                                grid: { top: 16, right: 16, bottom: 30, left: 55 },
                                                xAxis: {
                                                    type: 'category',
                                                    data: timePerQuestionData.map(d => d.question),
                                                    boundaryGap: true,
                                                },
                                                yAxis: {
                                                    type: 'value',
                                                    axisLabel: { formatter: '{value}s' },
                                                },
                                                tooltip: {
                                                    trigger: 'item',
                                                    formatter: (params: any) => {
                                                        if (params.seriesType === 'boxplot') {
                                                            // data[0] is the category index; actual values start at index 1
                                                            return `${params.name}<br/>Max: ${params.data[5]}s<br/>Q3: ${params.data[4]}s<br/>Median: ${params.data[3]}s<br/>Q1: ${params.data[2]}s<br/>Min: ${params.data[1]}s`;
                                                        }
                                                        return `${params.name}<br/>Outlier: ${params.data[1]}s`;
                                                    },
                                                },
                                                series: [
                                                    {
                                                        type: 'boxplot',
                                                        data: timePerQuestionData.map(d => [d.min, d.q1, d.med, d.q3, d.max]),
                                                        itemStyle: { color: 'transparent', borderColor: primaryColor, borderWidth: 2 },
                                                    },
                                                    {
                                                        type: 'scatter',
                                                        data: timePerQuestionData.flatMap((d, i) =>
                                                            d.outliers.map((o: number) => [i, o])
                                                        ),
                                                        itemStyle: { color: primaryColor },
                                                    },
                                                ],
                                            }}
                                        />
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

