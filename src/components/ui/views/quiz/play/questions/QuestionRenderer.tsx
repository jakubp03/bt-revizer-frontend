import { Dialog, DialogContent } from '@/components/ui/shadcn_ui/dialog';
import { getImageBlobUrl } from '@/services/imageService';
import type { QuestionInfo } from '@/types/quiz';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import FlashcardQuestion from './FlashcardQuestion';
import MatchingQuestion from './MatchingQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import OrderingQuestion from './OrderingQuestion';
import SingleChoiceQuestion from './SingleChoiceQuestion';
import TextInputQuestion from './TextInputQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';

/** Lazy-loads the image for a question on first render, caches the blob URL. */
function QuestionImage({ filename }: { filename: string }) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setBlobUrl(null);
        getImageBlobUrl(filename)
            .then((url) => {
                if (!cancelled) {
                    setBlobUrl(url);
                    setIsLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setIsLoading(false);
                    toast.error('Failed to load question image.');
                }
            });
        return () => {
            cancelled = true;
        };
    }, [filename]);

    /* Fixed-height uniform container — all images occupy the same space */
    return (
        <>
            <div className="mt-3 flex h-48 w-full max-w-md items-center justify-center overflow-hidden rounded-lg">
                {isLoading ? (
                    <Loader2 size={24} className="animate-spin text-muted-foreground" />
                ) : blobUrl ? (
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="h-full w-full hover:cursor-zoom-in"
                    >
                        <img
                            src={blobUrl}
                            alt="Question"
                            className="h-full w-full object-contain"
                        />
                    </button>
                ) : null}
            </div>

            {blobUrl && (
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden">
                        <img
                            src={blobUrl}
                            alt="Question enlarged"
                            className="max-h-[90vh] w-full object-contain"
                        />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default function QuestionRenderer({ question }: { question: QuestionInfo }) {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-xs text-muted-foreground">
                    Question {question.questionOrder} &middot; {question.points} {question.points === 1 ? 'point' : 'points'}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{question.questionText}</h2>
                {question.imagePath && <QuestionImage filename={question.imagePath} />}
            </div>

            {question.type === 'SINGLE_CHOICE' && <SingleChoiceQuestion question={question} />}
            {question.type === 'MULTIPLE_CHOICE' && <MultipleChoiceQuestion question={question} />}
            {question.type === 'TRUE_FALSE' && <TrueFalseQuestion question={question} />}
            {question.type === 'TEXT_INPUT' && <TextInputQuestion question={question} />}
            {question.type === 'MATCHING' && <MatchingQuestion question={question} />}
            {question.type === 'ORDERING' && <OrderingQuestion question={question} />}
            {question.type === 'FLASHCARD' && <FlashcardQuestion question={question} />}
        </div>
    );
}
