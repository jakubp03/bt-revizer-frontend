import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn_ui/card";
import LoadingSpinner from "@/components/ui/shared/LoadingSpinner";
import QuizCard from "@/components/ui/shared/QuizCard";
import api from "@/services/Api";
import type { Quiz } from "@/types/quiz";
import { BookOpen, Clock, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type DashboardData = {
    totalTimeSpent: number;
    submittedQuizzesCount: number;
    averageScorePercentage: number | null;
    recentQuizzes: Quiz[];
    monthlyActivity: Record<string, number>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
    if (seconds === 0) return "0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
    const s = seconds % 60;
    return m > 0 ? `${m}m` : `${s}s`;
}

// ─── Calendar Heatmap ────────────────────────────────────────────────────────

const HEAT_LEVELS = [
    "bg-muted",
    "bg-green-200 dark:bg-green-900",
    "bg-green-300 dark:bg-green-700",
    "bg-green-500 dark:bg-green-500",
    "bg-green-700 dark:bg-green-300",
] as const;

function getHeatLevel(count: number, maxCount: number): string {
    if (count === 0) return HEAT_LEVELS[0];
    const ratio = count / maxCount;
    if (ratio <= 0.25) return HEAT_LEVELS[1];
    if (ratio <= 0.5) return HEAT_LEVELS[2];
    if (ratio <= 0.75) return HEAT_LEVELS[3];
    return HEAT_LEVELS[4];
}

function HeatCell({
    dateStr,
    count,
    maxCount,
}: {
    dateStr: string;
    count: number;
    maxCount: number;
}) {
    const [hovered, setHovered] = useState(false);
    const label = count === 0
        ? "No submissions"
        : `${count} submission${count !== 1 ? "s" : ""}`;

    return (
        <div className="relative">
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={`h-6 w-6 cursor-default rounded-sm transition-opacity hover:opacity-80 ${getHeatLevel(count, maxCount)}`}
            />
            {hovered && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-[11px] text-popover-foreground shadow-md ring-1 ring-border">
                    <span className="font-medium">{dateStr}</span>
                    <br />
                    {label}
                </div>
            )}
        </div>
    );
}

function CalendarHeatmap({ activity }: { activity: Record<string, number> }) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayRaw = new Date(year, month, 1).getDay(); // 0 = Sun
    const firstDayMon = (firstDayRaw + 6) % 7; // Mon = 0

    const counts = Object.values(activity);
    const maxCount = counts.length > 0 ? Math.max(...counts) : 1;

    const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

    const paddingCells = Array.from({ length: firstDayMon }, (_, i) => (
        <div key={`pad-${i}`} />
    ));

    const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const count = activity[dateStr] ?? 0;
        return (
            <HeatCell key={day} dateStr={dateStr} count={count} maxCount={maxCount} />
        );
    });

    return (
        <div className="w-fit space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{monthLabel}</p>
            <div className="grid gap-1 text-center text-[10px] text-muted-foreground grid-cols-[repeat(7,1.5rem)]">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i}>{d}</div>
                ))}
            </div>
            <div className="grid gap-1 grid-cols-[repeat(7,1.5rem)]">{[...paddingCells, ...dayCells]}</div>
            <div className="flex items-center gap-1.5 pt-0.5 text-[10px] text-muted-foreground">
                <span>Less</span>
                {HEAT_LEVELS.map((cls, i) => (
                    <div key={i} className={`h-2.5 w-2.5 rounded-sm ${cls}`} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
}

// ─── Main View ───────────────────────────────────────────────────────────────

export default function HomeView() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        api.get("/attempt/dashboard")
            .then((res) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const raw = res.data as any;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const quizzes: Quiz[] = (raw.recentQuizzes ?? []).map((q: any) => ({
                    id: String(q.id),
                    title: q.title as string,
                    icon: (q.icon ?? "") as string,
                    timeLimit: q.timeLimit as boolean,
                    questionCount: q.questionCount as number,
                    categories: ((q.categories ?? []) as { id: number }[]).map((c) => ({
                        id: String(c.id),
                        name: "",
                        description: "",
                        color: "",
                    })),
                }));
                setData({
                    totalTimeSpent: raw.totalTimeSpent ?? 0,
                    submittedQuizzesCount: raw.submittedQuizzesCount ?? 0,
                    averageScorePercentage: raw.averageScorePercentage ?? null,
                    recentQuizzes: quizzes,
                    monthlyActivity: raw.monthlyActivity ?? {},
                });
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="flex h-full items-center justify-center text-destructive">
                Failed to load dashboard
            </div>
        );
    }

    if (!data) return null;

    const {
        totalTimeSpent,
        submittedQuizzesCount,
        averageScorePercentage,
        recentQuizzes,
        monthlyActivity,
    } = data;

    return (
        <div className="flex flex-col gap-8 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">Your activity overview</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Time Spent
                        </CardTitle>
                        <CardAction>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatTime(totalTimeSpent)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Past 7 days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Quizzes Submitted
                        </CardTitle>
                        <CardAction>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{submittedQuizzesCount}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Past 7 days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Average Score
                        </CardTitle>
                        <CardAction>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {averageScorePercentage !== null
                                ? `${averageScorePercentage.toFixed(1)}%`
                                : "—"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Past 7 days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Quizzes Carousel */}
            {recentQuizzes.length > 0 && (
                <section className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">Recent Quizzes</h2>
                        <p className="text-sm text-muted-foreground">
                            Quizzes you attempted in the past 7 days
                        </p>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
                        {recentQuizzes.map((quiz) => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                </section>
            )}

            {/* Monthly Activity */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">Monthly Activity</h2>
                    <p className="text-sm text-muted-foreground">Quiz submissions this month</p>
                </div>
                <Card className="w-fit px-6">
                    <CardContent className="pt-4">
                        <CalendarHeatmap activity={monthlyActivity} />
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
