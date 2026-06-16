import api from "@/services/Api";
import type { AttemptSummaryResponse, PageResponse } from "@/types/quiz";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../shadcn_ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../shadcn_ui/pagination";
import LoadingSpinner from "../shared/LoadingSpinner";

const PAGE_SIZE = 20;

export default function AttemptHistoryView() {
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<AttemptSummaryResponse> | null>(null);
    const [loadedPage, setLoadedPage] = useState<number | null>(null);
    const isLoading = loadedPage !== page;

    useEffect(() => {
        api.get<PageResponse<AttemptSummaryResponse>>('/attempt/all', {
            params: { page, size: PAGE_SIZE },
        })
            .then((res) => {
                const raw = res.data;
                setData({
                    ...raw,
                    content: raw.content.map((a) => ({
                        ...a,
                        id: String(a.id),
                        quizId: String(a.quizId),
                    })),
                });
                setLoadedPage(page);
            })
            .catch((err) => {
                console.error('Error fetching attempt history', err);
                setLoadedPage(page);
            });
    }, [page]);

    return (
        <div className="flex flex-col gap-6 p-6">
            <h1 className="text-3xl font-bold text-foreground">History</h1>

            <Card>
                <CardContent className="py-1">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : !data || data.content.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No attempts yet</p>
                    ) : (
                        <>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between px-4 pb-2 text-m font-medium text-muted-foreground border-b">
                                    <span>Quiz</span>
                                    <div className="flex items-center gap-8">
                                        <span>Date</span>
                                        <span>Score</span>
                                        <span className="w-20" />
                                    </div>
                                </div>
                                <ul className="flex flex-col">
                                    {data.content.map((attempt) => (
                                        <li key={attempt.id}>
                                            <Link
                                                to={`/quiz/${attempt.quizId}/review/${attempt.id}`}
                                                className="flex items-center justify-between rounded-md px-4 py-3 text-sm transition-colors hover:bg-muted"
                                            >
                                                <span className="font-medium truncate max-w-xs">{attempt.quizTitle}</span>
                                                <div className="flex items-center gap-8">
                                                    <span className="text-muted-foreground">
                                                        {new Date(attempt.submittedAt).toLocaleString(undefined, {
                                                            year: 'numeric',
                                                            month: 'numeric',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                    <span className="font-medium w-10 text-right">
                                                        {Math.round(attempt.scorePercentage)}%
                                                    </span>
                                                    <Link
                                                        to={`/quiz/${attempt.quizId}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="flex items-center gap-1 text-xs text-primary hover:underline w-20 justify-end"
                                                    >
                                                        <ExternalLink size={12} />
                                                        View quiz
                                                    </Link>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-center justify-between mt-4 px-4">
                                <span className="text-xs text-muted-foreground">
                                    Page {data.number + 1} of {data.totalPages}&nbsp;·&nbsp;{data.totalElements} total
                                </span>
                                <Pagination className="w-auto mx-0">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={data.first ? undefined : () => setPage((p) => p - 1)}
                                                aria-disabled={data.first}
                                                className={data.first ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: data.totalPages }, (_, i) => {
                                            const current = data.number;
                                            const total = data.totalPages;
                                            const show =
                                                i === 0 ||
                                                i === total - 1 ||
                                                Math.abs(i - current) <= 1;
                                            const showEllipsisBefore = i === current - 2 && current - 2 > 1;
                                            const showEllipsisAfter = i === current + 2 && current + 2 < total - 2;

                                            if (!show && !showEllipsisBefore && !showEllipsisAfter) return null;

                                            if (showEllipsisBefore || showEllipsisAfter) {
                                                return (
                                                    <PaginationItem key={`ellipsis-${i}`}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }

                                            return (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        isActive={i === current}
                                                        onClick={() => setPage(i)}
                                                        className="cursor-pointer"
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={data.last ? undefined : () => setPage((p) => p + 1)}
                                                aria-disabled={data.last}
                                                className={data.last ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
