import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn_ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn_ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCategoryStats, fetchCategoryStats, selectCategoryById } from "@/store/slices/categorySlice";
import ReactECharts from "echarts-for-react";
import { BookOpen, ChartNoAxesColumn, Clock, FolderOpen, History, RotateCcw, TrendingUp } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import QuizCard from "../../shared/QuizCard";

export default function CategoryDetailView() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const category = useAppSelector(selectCategoryById(id ?? ""));
    const { quizCollection } = useAppSelector((state) => state.quiz);
    const { selectedCategoryStats } = useAppSelector((state) => state.category);

    useEffect(() => {
        if (!id) return;
        dispatch(fetchCategoryStats(id));
        return () => {
            dispatch(clearCategoryStats());
        };
    }, [id, dispatch]);

    const categoryQuizzes = quizCollection.filter((quiz) =>
        quiz.categories.some((cat) => String(cat.id) === String(id)),
    );

    const attemptCount = selectedCategoryStats?.scorePercentages.length ?? null;
    const hasAttempts = attemptCount !== null && attemptCount > 0;
    const hasSufficientForMedian = attemptCount !== null && attemptCount > 5;

    const scoreOverAttemptsData = useMemo(() => {
        if (!selectedCategoryStats) return [];
        return selectedCategoryStats.scorePercentages.map((score, i) => ({
            attempt: i + 1,
            score: Math.round(score * 10) / 10,
        }));
    }, [selectedCategoryStats]);

    const timeOverAttemptsData = useMemo(() => {
        if (!selectedCategoryStats) return [];
        return selectedCategoryStats.attemptTimes.map((time, i) => ({
            attempt: i + 1,
            time,
        }));
    }, [selectedCategoryStats]);

    const primaryColor = useMemo(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6366f1';
    }, []);

    if (!category) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                Category not found
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <FolderOpen size={32} style={{ color: category.color }} className="shrink-0" />
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
                    {category.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                    )}
                </div>
            </div>

            {/* Info card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-foreground">Category Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        <div className="flex items-center gap-2 text-sm">
                            <BookOpen size={16} className="text-primary" />
                            <span className="text-muted-foreground">Quizzes:</span>
                            <span className="font-medium">{categoryQuizzes.length}</span>
                        </div>

                        {attemptCount !== null && (
                            <div className="flex items-center gap-2 text-sm">
                                <RotateCcw size={16} className="text-primary" />
                                <span className="text-muted-foreground">Total attempts:</span>
                                <span className="font-medium">{attemptCount}</span>
                            </div>
                        )}

                        {selectedCategoryStats?.averageScorePercentage != null && (
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp size={16} className="text-primary" />
                                <span className="text-muted-foreground">Avg score:</span>
                                <span className="font-medium">
                                    {Math.round(selectedCategoryStats.averageScorePercentage)}%
                                </span>
                            </div>
                        )}

                        {hasAttempts && (
                            <div className="flex items-center gap-2 text-sm">
                                <ChartNoAxesColumn size={16} className="text-primary" />
                                <span className="text-muted-foreground">Median score:</span>
                                <span className="font-medium">
                                    {hasSufficientForMedian && selectedCategoryStats?.medianScorePercentage != null
                                        ? `${Math.round(selectedCategoryStats.medianScorePercentage)}%`
                                        : "insufficient data"}
                                </span>
                            </div>
                        )}

                        {selectedCategoryStats?.averageAttemptTime != null && (
                            <div className="flex items-center gap-2 text-sm">
                                <Clock size={16} className="text-primary" />
                                <span className="text-muted-foreground">Avg time:</span>
                                <span className="font-medium">
                                    {Math.round(selectedCategoryStats.averageAttemptTime)}s
                                </span>
                            </div>
                        )}

                        {hasAttempts && (
                            <div className="flex items-center gap-2 text-sm">
                                <Clock size={16} className="text-primary" />
                                <span className="text-muted-foreground">Median time:</span>
                                <span className="font-medium">
                                    {hasSufficientForMedian && selectedCategoryStats?.medianAttemptTime != null
                                        ? `${Math.round(selectedCategoryStats.medianAttemptTime)}s`
                                        : "insufficient data"}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="quizzes">
                <TabsList>
                    <TabsTrigger value="quizzes" className="flex items-center gap-1.5">
                        <BookOpen size={14} />
                        Quizzes
                    </TabsTrigger>
                    <TabsTrigger value="attempts" className="flex items-center gap-1.5">
                        <History size={14} />
                        Previous Attempts
                    </TabsTrigger>
                    <TabsTrigger value="graphs" className="flex items-center gap-1.5">
                        <ChartNoAxesColumn size={14} />
                        Graphs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="quizzes">
                    {categoryQuizzes.length === 0 ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            No quizzes in this category
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {categoryQuizzes.map((quiz) => (
                                <QuizCard key={quiz.id} quiz={quiz} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="attempts">
                    <Card>
                        <CardContent className="py-6">
                            <p className="text-sm text-muted-foreground">No attempts yet</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="graphs">
                    <Tabs defaultValue="score-progress">
                        <TabsList className="mb-4">
                            <TabsTrigger value="score-progress">Score Progress</TabsTrigger>
                            <TabsTrigger value="time-progress">Time Progress</TabsTrigger>
                        </TabsList>

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
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
}
