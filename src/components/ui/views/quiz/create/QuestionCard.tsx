import { Button } from '@/components/ui/shadcn_ui/button';
import { Input } from '@/components/ui/shadcn_ui/input';
import ImageUploadBox from '@/components/ui/shared/ImageUploadBox';
import { uploadImage } from '@/services/imageService';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type {
    FlashcardForm,
    MatchingForm,
    MultipleChoiceForm,
    OrderingForm,
    QuestionForm,
    SingleChoiceForm,
    TextInputForm,
    TrueFalseForm,
} from '../../../../../types/quizCreationTypes';
import FlashcardEditor from './editors/FlashcardEditor';
import MatchingEditor from './editors/MatchingEditor';
import MultipleChoiceEditor from './editors/MultipleChoiceEditor';
import OrderingEditor from './editors/OrderingEditor';
import SingleChoiceEditor from './editors/SingleChoiceEditor';
import TextInputEditor from './editors/TextInputEditor';
import TrueFalseEditor from './editors/TrueFalseEditor';

const QUESTION_TYPE_LABELS: Record<QuestionForm['type'], string> = {
    SINGLE_CHOICE: 'Single Choice',
    MULTIPLE_CHOICE: 'Multiple Choice',
    TRUE_FALSE: 'True / False',
    TEXT_INPUT: 'Text Input',
    MATCHING: 'Matching',
    ORDERING: 'Ordering',
    FLASHCARD: 'Flashcard',
};

interface Props {
    question: QuestionForm;
    index: number;
    onDelete: () => void;
    onChange: (updated: QuestionForm) => void;
}

export default function QuestionCard({ question, index, onDelete, onChange }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: question.clientId,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadingPreviewUrl, setUploadingPreviewUrl] = useState<string | null>(null);

    const [prevPoints, setPrevPoints] = useState(question.points);
    const [pointsInput, setPointsInput] = useState<string>(String(question.points));

    if (prevPoints !== question.points) {
        setPrevPoints(question.points);
        setPointsInput(String(question.points));
    }

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
    };

    const handleFileSelect = async (file: File) => {
        setIsUploading(true);
        const localUrl = URL.createObjectURL(file);
        setUploadingPreviewUrl(localUrl);
        try {
            const filename = await uploadImage(file);
            if (question.imagePreviewUrl) URL.revokeObjectURL(question.imagePreviewUrl);
            onChange({ ...question, imagePreviewUrl: localUrl, imageFilename: filename });
        } catch {
            toast.error('Failed to upload image. Please try again.');
            URL.revokeObjectURL(localUrl);
        } finally {
            setUploadingPreviewUrl(null);
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        if (question.imagePreviewUrl) URL.revokeObjectURL(question.imagePreviewUrl);
        onChange({ ...question, imagePreviewUrl: null, imageFilename: null });
    };

    const renderEditor = () => {
        switch (question.type) {
            case 'SINGLE_CHOICE':
                return (
                    <SingleChoiceEditor
                        question={question as SingleChoiceForm}
                        onChange={(u) => onChange(u)}
                    />
                );
            case 'MULTIPLE_CHOICE':
                return (
                    <MultipleChoiceEditor
                        question={question as MultipleChoiceForm}
                        onChange={(u) => onChange(u)}
                    />
                );
            case 'TRUE_FALSE':
                return (
                    <TrueFalseEditor
                        question={question as TrueFalseForm}
                        onChange={(u) => onChange(u)}
                    />
                );
            case 'TEXT_INPUT':
                return (
                    <TextInputEditor
                        question={question as TextInputForm}
                        onChange={(u) => onChange(u)}
                    />
                );
            case 'MATCHING':
                return (
                    <MatchingEditor
                        question={question as MatchingForm}
                        onChange={(u) => onChange(u)}
                    />
                );
            case 'ORDERING':
                return (
                    <OrderingEditor
                        question={question as OrderingForm}
                        onChange={(u) => onChange(u)}
                    />
                );
            case 'FLASHCARD':
                return (
                    <FlashcardEditor
                        question={question as FlashcardForm}
                        onChange={(u) => onChange(u)}
                    />
                );
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
        >
            {/* Card header */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                    {index + 1}
                    <span className="ml-2 font-normal text-xs">
                        {QUESTION_TYPE_LABELS[question.type]}
                    </span>
                </span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        title="Drag to reorder"
                        className="cursor-grab touch-none rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:cursor-pointer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Question text + image — not shown for flashcard (FlashcardEditor handles layout) */}
            {question.type !== 'FLASHCARD' && (
                <div className="flex gap-3 items-start">
                    <div className="flex-1 flex flex-col gap-1.5">
                        <div className="rounded-lg bg-muted p-3 min-h-20">
                            <textarea
                                placeholder="Enter question text"
                                value={question.questionText}
                                onChange={(e) =>
                                    onChange({ ...question, questionText: e.target.value })
                                }
                                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                rows={3}
                            />
                        </div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground px-1">
                            Question
                        </span>
                    </div>

                    {/* Image upload */}
                    <ImageUploadBox
                        className="pt-0.5"
                        imagePreviewUrl={uploadingPreviewUrl ?? question.imagePreviewUrl}
                        isUploading={isUploading}
                        onFileSelect={handleFileSelect}
                        onRemove={handleRemove}
                    />
                </div>
            )}

            {/* Type-specific editor */}
            <div>{renderEditor()}</div>

            {/* Points */}
            <div className="flex items-center gap-2 border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Points:</span>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        onClick={() => onChange({ ...question, points: Math.max(1, question.points - 1) })}
                        disabled={question.points <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                        type="number"
                        min={1}
                        value={pointsInput}
                        onChange={(e) => {
                            setPointsInput(e.target.value);
                            const v = parseInt(e.target.value);
                            if (!isNaN(v) && v >= 1) onChange({ ...question, points: v });
                        }}
                        onBlur={() => {
                            const v = parseInt(pointsInput);
                            const clamped = !isNaN(v) && v >= 1 ? v : 1;
                            setPointsInput(String(clamped));
                            onChange({ ...question, points: clamped });
                        }}
                        className="h-7 w-14 text-center bg-background"
                    />
                    <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        onClick={() => onChange({ ...question, points: question.points + 1 })}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
