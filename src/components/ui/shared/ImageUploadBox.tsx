import { Dialog, DialogContent } from '@/components/ui/shadcn_ui/dialog';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
    /** Local blob URL to display as the thumbnail. */
    imagePreviewUrl: string | null;
    /** Whether an upload is currently in progress. Shows a spinner overlay on the thumbnail. */
    isUploading: boolean;
    /** Called when the user selects a new file. Parent is responsible for uploading. */
    onFileSelect: (file: File) => void;
    /** Called when the user removes the current image. */
    onRemove: () => void;
    className?: string;
}

/**
 * Reusable image upload control for quiz creation.
 * Shows a 1:1 square thumbnail (object-cover) with upload/loading/remove states.
 * Clicking the thumbnail opens a full-size modal.
 */
export default function ImageUploadBox({ imagePreviewUrl, isUploading, onFileSelect, onRemove, className }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
            e.target.value = '';
        }
    };

    const hasImage = imagePreviewUrl !== null || isUploading;

    return (
        <div className={cn('flex flex-col items-center gap-1.5', className)}>
            {hasImage ? (
                <div className="relative">
                    {/* 1:1 square thumbnail — object-cover to fill without squeezing */}
                    <button
                        type="button"
                        onClick={() => !isUploading && imagePreviewUrl && setModalOpen(true)}
                        disabled={isUploading || !imagePreviewUrl}
                        className="relative flex h-20 w-20 overflow-hidden rounded-lg border border-border hover:cursor-pointer disabled:cursor-default"
                    >
                        {imagePreviewUrl && (
                            <img
                                src={imagePreviewUrl}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                                <Loader2 size={20} className="animate-spin text-white" />
                            </div>
                        )}
                    </button>

                    {/* Remove button — hidden while uploading */}
                    {!isUploading && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="absolute -right-2 -top-2 z-10 rounded-full bg-card p-0.5 text-muted-foreground ring-1 ring-border transition-colors hover:text-destructive hover:cursor-pointer"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            ) : (
                /* Empty state: dashed upload button */
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary hover:cursor-pointer"
                >
                    <ImageIcon size={20} />
                    <span className="text-xs">Image</span>
                </button>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleChange}
            />

            {/* Full-size enlarge modal */}
            {imagePreviewUrl && (
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="max-w-3xl p-0 overflow-hidden">
                        <img
                            src={imagePreviewUrl}
                            alt="Preview enlarged"
                            className="max-h-[85vh] w-full object-contain"
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
