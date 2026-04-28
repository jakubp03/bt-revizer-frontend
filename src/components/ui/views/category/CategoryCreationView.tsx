import { Alert, AlertDescription } from '@/components/ui/shadcn_ui/alert';
import { Badge } from '@/components/ui/shadcn_ui/badge';
import { Button } from '@/components/ui/shadcn_ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn_ui/card';
import { Input } from '@/components/ui/shadcn_ui/input';
import { Label } from '@/components/ui/shadcn_ui/label';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createCategory } from '@/store/thunks/categoryThunks';
import { ArrowLeft, Check, FolderPlus, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PRESET_COLORS = [
    '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
    '#F97316', '#EAB308', '#22C55E', '#14B8A6',
    '#3B82F6', '#06B6D4', '#A855F7', '#F43F5E',
];

export default function CategoryCreationView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { quizCollection, isLoadingQuizes } = useAppSelector((state) => state.quiz);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#6366F1');
    const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>([]);
    const [quizSearchTerm, setQuizSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; general?: string }>({});

    const filteredQuizzes = quizCollection.filter((quiz) =>
        quiz.title.toLowerCase().includes(quizSearchTerm.toLowerCase()),
    );

    const toggleQuiz = (id: string) => {
        setSelectedQuizIds((prev) =>
            prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
        );
    };

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!name.trim()) newErrors.name = 'Category name is required.';
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setIsSubmitting(true);
        try {
            await dispatch(
                createCategory({
                    name: name.trim(),
                    description: description.trim(),
                    color,
                    quizIds: selectedQuizIds.map(Number),
                }),
            ).unwrap();
            navigate('/');
        } catch {
            setErrors({ general: 'Failed to create category. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 pb-16 max-w-3xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <FolderPlus size={22} className="text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">New Category</h1>
                        <p className="text-sm text-muted-foreground">Fill in the details and assign quizzes</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* General error */}
                {errors.general && (
                    <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
                        <AlertDescription className="text-destructive">{errors.general}</AlertDescription>
                    </Alert>
                )}

                {/* Card wrapping all fields */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">Category Details</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">

                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="cat-name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="cat-name"
                                placeholder="e.g. Mathematics"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                                }}
                                className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="cat-desc">Description</Label>
                            <textarea
                                id="cat-desc"
                                placeholder="Optional description…"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* Color */}
                        <div className="flex flex-col gap-2">
                            <Label>Color</Label>
                            <div className="flex flex-wrap items-center gap-2">
                                {PRESET_COLORS.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setColor(preset)}
                                        className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                                        style={{
                                            backgroundColor: preset,
                                            borderColor: color === preset ? 'white' : 'transparent',
                                            boxShadow: color === preset ? `0 0 0 2px ${preset}` : undefined,
                                        }}
                                        aria-label={preset}
                                    />
                                ))}
                                {/* Custom color via native picker */}
                                <label
                                    className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/50 transition-colors hover:border-primary"
                                    title="Custom color"
                                >
                                    <span className="text-xs text-muted-foreground select-none">+</span>
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    />
                                </label>
                                {/* Preview swatch */}
                                <div className="ml-2 flex items-center gap-2">
                                    <div
                                        className="h-7 w-7 rounded-full border border-border"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="font-mono text-xs text-muted-foreground">{color}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quiz selection */}
                        <div className="flex flex-col gap-2">
                            <Label>Add Quizzes</Label>
                            <p className="text-xs text-muted-foreground">
                                Select quizzes to associate with this category.
                            </p>

                            {/* Selected quiz chips */}
                            {selectedQuizIds.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedQuizIds.map((id) => {
                                        const quiz = quizCollection.find((q) => q.id === id);
                                        return (
                                            <Badge
                                                key={id}
                                                variant="outline"
                                                className="h-auto gap-1 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary"
                                            >
                                                {quiz?.icon && <span>{quiz.icon}</span>}
                                                {quiz?.title ?? id}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleQuiz(id)}
                                                    className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Scrollable quiz list */}
                            <div className="rounded-lg border border-input bg-transparent">
                                <div className="border-b border-input px-3 py-2">
                                    <Input
                                        placeholder="Search quizzes…"
                                        value={quizSearchTerm}
                                        onChange={(e) => setQuizSearchTerm(e.target.value)}
                                        className="h-8 border-0 p-0 shadow-none focus-visible:ring-0"
                                    />
                                </div>
                                <div className="max-h-52 overflow-y-auto">
                                    {isLoadingQuizes ? (
                                        <p className="px-4 py-3 text-sm text-muted-foreground">Loading quizzes…</p>
                                    ) : filteredQuizzes.length === 0 ? (
                                        <p className="px-4 py-3 text-sm text-muted-foreground">No quizzes found.</p>
                                    ) : (
                                        filteredQuizzes.map((quiz) => {
                                            const selected = selectedQuizIds.includes(quiz.id);
                                            return (
                                                <button
                                                    key={quiz.id}
                                                    type="button"
                                                    onClick={() => toggleQuiz(quiz.id)}
                                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                                >
                                                    {/* Checkbox indicator */}
                                                    <span
                                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selected
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-input bg-transparent'
                                                            }`}
                                                    >
                                                        {selected && <Check size={10} strokeWidth={3} />}
                                                    </span>
                                                    {quiz.icon && (
                                                        <span className="text-base leading-none">{quiz.icon}</span>
                                                    )}
                                                    <span className="flex-1 truncate">{quiz.title}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {quiz.questionCount} Q
                                                    </span>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating…' : 'Create Category'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
