import { Button } from '@/components/ui/shadcn_ui/button';
import { Card, CardContent } from '@/components/ui/shadcn_ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/shadcn_ui/chart';
import { Separator } from '@/components/ui/shadcn_ui/separator';
import type { QuizResultResponse } from '@/types/quiz';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Pie, PieChart } from 'recharts';

const chartConfig = {
    correct: { label: 'Correct', color: 'var(--success)' },
    incorrect: { label: 'Incorrect', color: 'var(--destructive)' },
} satisfies ChartConfig;

export default function QuizResultView() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results as QuizResultResponse | undefined;

    if (!results) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>No results available. <a href="/" className="underline">Go home</a></p>
            </div>
        );
    }

    const score = Math.round(results.scorePercentage);
    const chartData = [
        { name: 'correct', value: score, fill: 'var(--color-correct)' },
        { name: 'incorrect', value: 100 - score, fill: 'var(--color-incorrect)' },
    ];

    return (
        <div className="flex items-center justify-center h-full p-4">
            <Card className="w-full max-w-lg">
                <CardContent className="flex flex-col items-center gap-6 pt-6">
                    {/* Score + Pie Chart */}
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-5xl font-bold">{score}%</span>
                        <ChartContainer config={chartConfig} className="h-24 w-24">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={28}
                                    outerRadius={40}
                                    strokeWidth={2}
                                />
                            </PieChart>
                        </ChartContainer>
                    </div>

                    <Separator />

                    {/* Stats row */}
                    <div className="flex w-full justify-around">
                        {results.previousAttemptScorePercentage != null && (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground">previous attempt</span>
                                <span className="text-2xl font-semibold">{Math.round(results.previousAttemptScorePercentage)}%</span>
                            </div>
                        )}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground">average score</span>
                            <span className="text-2xl font-semibold">{Math.round(results.averageScorePercentage)}%</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex w-full justify-around gap-2 pb-2">
                        <Button variant="outline" onClick={() => navigate('/')}>exit to home</Button>
                        <Button variant="outline">view results</Button>
                        <Button variant="outline" onClick={() => navigate(`/quiz/${id}/play`)}>try again</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
