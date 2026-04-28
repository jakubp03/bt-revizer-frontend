import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn_ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn_ui/tabs";
import { useAppSelector } from "@/store/hooks";
import { selectCategoryById } from "@/store/slices/categorySlice";
import { BookOpen, ChartNoAxesColumn, FolderOpen, History } from "lucide-react";
import { useParams } from "react-router-dom";
import QuizCard from "../../shared/QuizCard";

export default function CategoryDetailView() {
    const { id } = useParams<{ id: string }>();

    const category = useAppSelector(selectCategoryById(id ?? ""));
    const { quizCollection } = useAppSelector((state) => state.quiz);

    const categoryQuizzes = quizCollection.filter((quiz) =>
        quiz.categories.some((cat) => String(cat.id) === String(id)),
    );

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
                    <CardTitle className="text-sm font-medium text-muted-foreground">Category Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                        <BookOpen size={16} className="text-primary" />
                        <span className="text-muted-foreground">Quizzes:</span>
                        <span className="font-medium">{categoryQuizzes.length}</span>
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
                    <TabsTrigger value="statistics" className="flex items-center gap-1.5">
                        <ChartNoAxesColumn size={14} />
                        Statistics
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

                <TabsContent value="statistics">
                    <Card>
                        <CardContent className="py-6">
                            <p className="text-sm text-muted-foreground">No statistics yet</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
