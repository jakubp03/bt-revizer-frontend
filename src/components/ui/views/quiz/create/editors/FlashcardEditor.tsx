import ImageUploadBox from '@/components/ui/shared/ImageUploadBox';
import { uploadImage } from '@/services/imageService';
import { useState } from 'react';
import { toast } from 'sonner';
import type { FlashcardForm } from '../../../../../../types/quizCreationTypes';

interface Props {
    question: FlashcardForm;
    onChange: (updated: FlashcardForm) => void;
}

export default function FlashcardEditor({ question, onChange }: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingPreviewUrl, setUploadingPreviewUrl] = useState<string | null>(null);

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
            <ImageUploadBox
                className="pt-0.5"
                imagePreviewUrl={uploadingPreviewUrl ?? question.imagePreviewUrl}
                isUploading={isUploading}
                onFileSelect={handleFileSelect}
                onRemove={handleRemove}
            />
        </div>
    );
}
