import { useAppSelector } from "@/store/hooks";
import LoadingSpinner from "../../shared/LoadingSpinner";
import QuizCard from "./QuizCard";

export default function LibraryView() {
    const { quizCollection, isLoadingQuizes } = useAppSelector(
        (state) => state.quiz,
    );

    if (isLoadingQuizes) {
        return (
            <LoadingSpinner />
        );
    }

    if (quizCollection.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                No quizzes available
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-foreground">Library</h1>
                <h2 className="text-sm text-muted-foreground">All quizzes</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quizCollection.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                ))}
            </div>
        </div>
    );
}
