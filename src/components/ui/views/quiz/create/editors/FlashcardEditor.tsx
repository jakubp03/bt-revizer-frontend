import { Image, X } from 'lucide-react';
import { useRef } from 'react';
import type { FlashcardForm } from '../../../../../../types/quizCreationTypes';

interface Props {
    question: FlashcardForm;
    onChange: (updated: FlashcardForm) => void;
}

export default function FlashcardEditor({ question, onChange }: Props) {
    const imageRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onChange({ ...question, imagePreviewUrl: url });
        }
    };

    return (
        <div className="flex gap-3 items-stretch">
            {/* Term */}
            <div className="flex-1 flex flex-col gap-1.5">
                <div className="rounded-lg bg-muted p-3 min-h-20">
                    <textarea
                        placeholder="Enter term"
                        value={question.questionText}
                        onChange={(e) => onChange({ ...question, questionText: e.target.value })}
                        className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        rows={3}
                    />
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground px-1">Term</span>
            </div>

            {/* Definition */}
            <div className="flex-1 flex flex-col gap-1.5">
                <div className="rounded-lg bg-muted p-3 min-h-20">
                    <textarea
                        placeholder="Enter definition"
                        value={question.backText}
                        onChange={(e) => onChange({ ...question, backText: e.target.value })}
                        className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        rows={3}
                    />
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground px-1">Definition</span>
            </div>

            {/* Image */}
            <div className="flex flex-col items-center gap-1.5 pt-0.5">
                {question.imagePreviewUrl ? (
                    <div className="relative">
                        <img
                            src={question.imagePreviewUrl}
                            alt="Preview"
                            className="h-20 w-20 rounded-lg object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => onChange({ ...question, imagePreviewUrl: null })}
                            className="absolute -right-2 -top-2 rounded-full bg-card p-0.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => imageRef.current?.click()}
                        className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary hover:cursor-pointer"
                    >
                        <Image size={20} />
                        <span className="text-xs">Image</span>
                    </button>
                )}
                <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </div>
        </div>
    );
}
