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
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMatchBasedAnswer } from '@/store/slices/quizPlaySlice';
import type { QuestionInfo } from '@/types/quiz';
import { GripVertical } from 'lucide-react';
import { useMemo } from 'react';

function DraggableRightItem({ id, text }: { id: string; text: string }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 rounded-lg border bg-card p-2 text-sm ${isDragging ? 'z-10 shadow-lg ring-2 ring-primary' : 'border-border'}`}
        >
            <button
                type="button"
                className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
                {...attributes}
                {...listeners}
            >
                <GripVertical size={14} />
            </button>
            <span>{text}</span>
        </div>
    );
}

export default function MatchingQuestion({ question }: { question: QuestionInfo }) {
    const dispatch = useAppDispatch();
    const storedPairs = useAppSelector((s) => s.quizPlay.matchBasedAnswers[question.id.toString()]);

    // Left side stays fixed in order. Right side is reorderable.
    const leftItems = useMemo(
        () => question.matchPairs.map((p) => ({ id: p.id.toString(), text: p.leftSide })),
        [question.matchPairs],
    );

    // Shuffle right side initially
    const initialRightOrder = useMemo(() => {
        const rights = question.matchPairs.map((p) => ({ id: p.id.toString(), text: p.rightSide }));
        const shuffled = [...rights];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question.id]);

    // Derive current right order from stored pairs, or use initial shuffle
    const currentRightOrder = useMemo(() => {
        if (storedPairs && storedPairs.length === leftItems.length) {
            // Rebuild order: for each left item (in order), find the matched rightId
            return storedPairs.map((pair) => {
                const original = initialRightOrder.find((r) => r.id === pair.rightId);
                return original ?? { id: pair.rightId, text: '?' };
            });
        }
        return initialRightOrder;
    }, [storedPairs, leftItems.length, initialRightOrder]);

    const rightIds = currentRightOrder.map((r) => r.id);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const savePairs = (newRightOrder: typeof currentRightOrder) => {
        const pairs = leftItems.map((left, i) => ({
            leftId: left.id,
            rightId: newRightOrder[i].id,
        }));
        dispatch(setMatchBasedAnswer({ questionId: question.id.toString(), pairs }));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = rightIds.indexOf(active.id as string);
        const newIndex = rightIds.indexOf(over.id as string);
        const newOrder = [...currentRightOrder];
        const [moved] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, moved);

        savePairs(newOrder);
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">Drag the right column items to match them with the left column.</p>
            <div className="grid grid-cols-2 gap-4">
                {/* Left column — fixed */}
                <div className="flex flex-col gap-2">
                    {leftItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center rounded-lg border border-primary/30 bg-primary/5 p-2 text-sm"
                        >
                            {item.text}
                        </div>
                    ))}
                </div>

                {/* Right column — draggable */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={rightIds} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-2">
                            {currentRightOrder.map((item) => (
                                <DraggableRightItem key={item.id} id={item.id} text={item.text} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
