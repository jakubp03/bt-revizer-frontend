import { Button } from '@/components/ui/shadcn_ui/button';
import { Input } from '@/components/ui/shadcn_ui/input';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createQuiz } from '@/store/thunks/quizThunks';
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import {
    AlarmClock,
    AlarmClockOff,
    ArrowLeft,
    BookOpen,
    Check,
    ChevronDown,
    CircleDot,
    GripVertical,
    List,
    Plus,
    RotateCcw,
    ScanText,
    Shuffle,
    Smile,
    SquareStack,
    ToggleLeft,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuestionCreationType, QuestionForm } from '../../../../../types/quizCreationTypes';
import { createQuestion } from '../../../../../types/quizCreationTypes';
import CategoryForm from '../../category/CategoryForm';
import QuestionCard from './QuestionCard';
import TimePicker from './TimePicker';

const QUESTION_TYPE_OPTIONS: {
    type: QuestionCreationType;
    label: string;
    icon: ReactNode;
}[] = [
        { type: 'SINGLE_CHOICE', label: 'Single Choice', icon: <CircleDot size={16} /> },
        { type: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: <Check size={16} /> },
        { type: 'TRUE_FALSE', label: 'True / False', icon: <ToggleLeft size={16} /> },
        { type: 'TEXT_INPUT', label: 'Text Input', icon: <ScanText size={16} /> },
        { type: 'MATCHING', label: 'Matching', icon: <Shuffle size={16} /> },
        { type: 'ORDERING', label: 'Ordering', icon: <List size={16} /> },
        { type: 'FLASHCARD', label: 'Flashcard', icon: <SquareStack size={16} /> },
    ];

function buildPayload(
    title: string,
    description: string,
    icon: string,
    timeLimitEnabled: boolean,
    timeLimitSeconds: number,
    selectedCategoryIds: string[],
    questions: QuestionForm[],
) {
    return {
        title: title.trim(),
        description: description.trim() || undefined,
        icon: icon.trim() || undefined,
        timeLimit: timeLimitEnabled ? timeLimitSeconds : null,
        gradingMethod: 'OnePointPerAnswer',
        categoryIds: selectedCategoryIds.map(Number),
        questions: questions.map((q) => {
            const base = {
                type: q.type,
                questionText: q.questionText.trim(),
                imagePath: null as string | null,
                points: q.points,
            };
            switch (q.type) {
                case 'SINGLE_CHOICE':
                case 'MULTIPLE_CHOICE':
                    return {
                        ...base,
                        choiceOptions: q.options.map((o) => ({
                            text: o.text.trim(),
                            isCorrect: o.isCorrect,
                        })),
                    };
                case 'TRUE_FALSE':
                    return { ...base, correctAnswer: q.correctAnswer };
                case 'TEXT_INPUT':
                    return {
                        ...base,
                        textConfig: {
                            reviewType: q.reviewType,
                            correctAnswer: q.correctAnswer.trim() || undefined,
                        },
                    };
                case 'MATCHING':
                    return {
                        ...base,
                        matchPairs: q.pairs.map((p) => ({
                            leftSide: p.leftSide.trim(),
                            rightSide: p.rightSide.trim(),
                        })),
                    };
                case 'ORDERING':
                    return {
                        ...base,
                        orderItems: q.items.map((i) => ({ text: i.text.trim() })),
                    };
                case 'FLASHCARD':
                    return { ...base, flashcardBackText: q.backText.trim() };
            }
        }),
    };
}

function validate(
    title: string,
    questions: QuestionForm[],
): string | null {
    if (!title.trim()) return 'Quiz title is required.';
    if (questions.length === 0) return 'Add at least one question.';

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const num = i + 1;

        if (!q.questionText.trim() && q.type !== 'FLASHCARD')
            return `Question ${num}: question text is required.`;
        if (q.type === 'FLASHCARD' && !q.questionText.trim())
            return `Question ${num} (Flashcard): term is required.`;
        if (q.type === 'FLASHCARD' && !q.backText.trim())
            return `Question ${num} (Flashcard): definition is required.`;

        if (q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE') {
            if (q.options.some((o) => !o.text.trim()))
                return `Question ${num}: all options must have text.`;
            if (!q.options.some((o) => o.isCorrect))
                return `Question ${num}: select at least one correct option.`;
            if (q.type === 'SINGLE_CHOICE' && q.options.filter((o) => o.isCorrect).length > 1)
                return `Question ${num}: single choice can only have one correct option.`;
        }

        if (q.type === 'MATCHING') {
            if (q.pairs.some((p) => !p.leftSide.trim() || !p.rightSide.trim()))
                return `Question ${num}: all matching pairs must be filled.`;
        }

        if (q.type === 'ORDERING') {
            if (q.items.some((it) => !it.text.trim()))
                return `Question ${num}: all ordering items must have text.`;
        }

        if (q.type === 'TEXT_INPUT' && q.reviewType === 'AUTOMATIC' && !q.correctAnswer.trim())
            return `Question ${num}: automatic review requires a correct answer.`;
    }

    return null;
}

export default function QuizCreationView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const categories = useAppSelector((state) => state.category.categoryCollection);

    // Quiz metadata
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('');
    const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
    const [timeLimitSeconds, setTimeLimitSeconds] = useState(300);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

    // Questions
    const [questions, setQuestions] = useState<QuestionForm[]>([]);

    // UI state
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [questionTypeMenuOpen, setQuestionTypeMenuOpen] = useState(false);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);

    // Refs for click-outside
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const questionTypeMenuRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(e.target as Node)
            ) {
                setCategoryDropdownOpen(false);
            }
            if (
                questionTypeMenuRef.current &&
                !questionTypeMenuRef.current.contains(e.target as Node)
            ) {
                setQuestionTypeMenuOpen(false);
            }
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(e.target as Node)
            ) {
                setEmojiPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // DnD
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setQuestions((prev) => {
                const oldIndex = prev.findIndex((q) => q.clientId === active.id);
                const newIndex = prev.findIndex((q) => q.clientId === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const addQuestion = (type: QuestionCreationType) => {
        setQuestions((prev) => [...prev, createQuestion(type)]);
        setQuestionTypeMenuOpen(false);
    };

    const updateQuestion = (clientId: string, updated: QuestionForm) => {
        setQuestions((prev) => prev.map((q) => (q.clientId === clientId ? updated : q)));
    };

    const deleteQuestion = (clientId: string) => {
        setQuestions((prev) => prev.filter((q) => q.clientId !== clientId));
    };

    const toggleCategory = (id: string) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
        );
    };

    const handleSubmit = async () => {
        const validationError = validate(title, questions);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);
        setIsSubmitting(true);

        const payload = buildPayload(
            title,
            description,
            icon,
            timeLimitEnabled,
            timeLimitSeconds,
            selectedCategoryIds,
            questions,
        );

        const result = await dispatch(createQuiz(payload));
        setIsSubmitting(false);

        if (createQuiz.fulfilled.match(result)) {
            navigate(`/quiz/${result.payload.id}`);
        } else {
            setError('Failed to create quiz. Please try again.');
        }
    };

    const availableCategories = categories.filter((c) => !selectedCategoryIds.includes(c.id));

    return (
        <div className="flex flex-col gap-6 p-6 pb-16 max-w-3xl mx-auto w-full">
            {/* Page header */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <BookOpen size={22} className="text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Create Quiz</h1>
                        <p className="text-sm text-muted-foreground">Fill in the details and add questions</p>
                    </div>
                </div>
            </div>

            {/* Quiz metadata */}
            <div className="flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
                <h2 className="text-sm font-semibold text-foreground">Quiz Details</h2>

                <div className="flex flex-col gap-3">
                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Title <span className="text-destructive">*</span>
                        </label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Quiz title"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                            rows={2}
                            className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 transition-colors"
                        />
                    </div>

                    {/* Icon + Time limit row */}
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                Icon (emoji)
                            </label>
                            <div ref={emojiPickerRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setEmojiPickerOpen((v) => !v)}
                                    className="flex h-8 w-16 items-center justify-center rounded-lg border border-input bg-transparent transition-colors hover:border-ring hover:cursor-pointer"
                                >
                                    {icon ? (
                                        <span className="text-xl leading-none">{icon}</span>
                                    ) : (
                                        <Smile size={18} className="text-muted-foreground/40" />
                                    )}
                                </button>
                                {emojiPickerOpen && (
                                    <div className="absolute left-0 top-full z-50 mt-1.5">
                                        <EmojiPicker
                                            theme={Theme.AUTO}
                                            onEmojiClick={(data: EmojiClickData) => {
                                                setIcon(data.emoji);
                                                setEmojiPickerOpen(false);
                                            }}
                                            width={320}
                                            height={380}
                                        />
                                    </div>
                                )}
                            </div>
                            {icon && (
                                <button
                                    type="button"
                                    onClick={() => setIcon('')}
                                    className="text-xs text-muted-foreground hover:text-destructive transition-colors hover:cursor-pointer"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-xs font-medium text-muted-foreground">
                                Time Limit
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setTimeLimitEnabled((v) => !v)}
                                    className={cn(
                                        'flex h-8 items-center gap-1.5 rounded-lg border-2 px-3 text-sm font-medium transition-colors hover:cursor-pointer',
                                        timeLimitEnabled
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                                    )}
                                >
                                    {timeLimitEnabled ? (
                                        <AlarmClock size={15} />
                                    ) : (
                                        <AlarmClockOff size={15} />
                                    )}
                                    {timeLimitEnabled ? 'Enabled' : 'Disabled'}
                                </button>
                                {timeLimitEnabled && (
                                    <TimePicker
                                        totalSeconds={timeLimitSeconds}
                                        onChange={setTimeLimitSeconds}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Categories</label>
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Selected category badges */}
                            {selectedCategoryIds.map((id) => {
                                const cat = categories.find((c) => c.id === id);
                                if (!cat) return null;
                                return (
                                    <span
                                        key={id}
                                        className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                                        style={{ backgroundColor: cat.color }}
                                    >
                                        {cat.name}
                                        <button
                                            type="button"
                                            onClick={() => toggleCategory(id)}
                                            className="hover:opacity-70 transition-opacity hover:cursor-pointer"
                                        >
                                            <X size={11} />
                                        </button>
                                    </span>
                                );
                            })}

                            {/* Add category button */}
                            <div ref={categoryDropdownRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setCategoryDropdownOpen((v) => !v)}
                                    className="flex h-7 items-center gap-1 rounded-full border-2 border-dashed border-border px-2.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary hover:cursor-pointer"
                                >
                                    <Plus size={13} />
                                    Add
                                </button>

                                {categoryDropdownOpen && (
                                    <div className="absolute left-0 top-full z-50 mt-1.5 min-w-45 max-h-52 overflow-y-auto rounded-xl bg-popover p-1 shadow-lg ring-1 ring-foreground/10">
                                        {availableCategories.length === 0 ? (
                                            <p className="px-3 py-2 text-xs text-muted-foreground">
                                                {categories.length === 0
                                                    ? 'No categories yet'
                                                    : 'All categories selected'}
                                            </p>
                                        ) : (
                                            availableCategories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => {
                                                        toggleCategory(cat.id);
                                                        setCategoryDropdownOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted hover:cursor-pointer"
                                                >
                                                    <span
                                                        className="h-3 w-3 shrink-0 rounded-full"
                                                        style={{ backgroundColor: cat.color }}
                                                    />
                                                    {cat.name}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* New category button */}
                            <button
                                type="button"
                                onClick={() => setNewCategoryModalOpen(true)}
                                className="flex h-7 items-center gap-1 rounded-full border border-border px-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary hover:cursor-pointer"
                            >
                                <BookOpen size={12} />
                                New Category
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={questions.map((q) => q.clientId)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-4">
                        {questions.map((q, i) => (
                            <QuestionCard
                                key={q.clientId}
                                question={q}
                                index={i}
                                onDelete={() => deleteQuestion(q.clientId)}
                                onChange={(updated) => updateQuestion(q.clientId, updated)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {questions.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-12 text-muted-foreground">
                    <GripVertical size={32} className="opacity-40" />
                    <p className="text-sm">No questions yet. Click the button below to add one.</p>
                </div>
            )}

            {/* Add question button */}
            <div ref={questionTypeMenuRef} className="relative flex justify-center mb-52">
                <button
                    type="button"
                    onClick={() => setQuestionTypeMenuOpen((v) => !v)}
                    className={cn(
                        'flex items-center gap-2 rounded-xl border-2 border-dashed px-6 py-3 text-sm font-medium transition-colors hover:cursor-pointer',
                        questionTypeMenuOpen
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
                    )}
                >
                    <Plus size={18} />
                    Add Question
                    <ChevronDown
                        size={15}
                        className={cn(
                            'transition-transform',
                            questionTypeMenuOpen && 'rotate-180',
                        )}
                    />
                </button>

                {questionTypeMenuOpen && (
                    <div className="absolute top-full z-50 mt-2 min-w-55 rounded-xl bg-popover p-1 shadow-lg ring-1 ring-foreground/10">
                        {QUESTION_TYPE_OPTIONS.map(({ type, label, icon: Icon }) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => addQuestion(type)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted hover:cursor-pointer"
                            >
                                <span className="text-primary">{Icon}</span>
                                {label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive ring-1 ring-destructive/20">
                    <RotateCcw size={14} />
                    {error}
                </div>
            )}

            {/* Submit */}
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Creating…' : 'Create Quiz'}
                </Button>
            </div>

            {/* New category modal */}
            {newCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg max-h-[75vh] overflow-y-auto styled-scrollbar">
                        <CategoryForm
                            onSuccess={(category) => {
                                setNewCategoryModalOpen(false);
                                setSelectedCategoryIds((prev) => [...prev, category.id]);
                            }}
                            onCancel={() => setNewCategoryModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
