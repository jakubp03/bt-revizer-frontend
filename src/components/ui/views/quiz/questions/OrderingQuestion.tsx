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
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setIdBasedAnswer } from '@/store/slices/quizPlaySlice';
import type { QuestionInfo } from '@/types/quiz';
import { GripVertical } from 'lucide-react';
import { useMemo } from 'react';

function SortableItem({ id, text }: { id: string; text: string }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 rounded-lg border bg-card p-3 ${isDragging ? 'z-10 shadow-lg ring-2 ring-primary' : 'border-border'}`}
        >
            <button
                type="button"
                className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
                {...attributes}
                {...listeners}
            >
                <GripVertical size={16} />
            </button>
            <span className="text-sm">{text}</span>
        </div>
    );
}

export default function OrderingQuestion({ question }: { question: QuestionInfo }) {
    const dispatch = useAppDispatch();
    const storedOrder = useAppSelector((s) => s.quizPlay.idBasedAnswers[question.id.toString()]);

    // Shuffle on first render if no stored order yet
    const initialShuffled = useMemo(() => {
        const ids = question.orderItems.map((item) => item.id.toString());
        // Fisher-Yates shuffle
        const shuffled = [...ids];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question.id]);

    const currentOrder = storedOrder ?? initialShuffled;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const itemMap = useMemo(() => {
        const map = new Map<string, string>();
        question.orderItems.forEach((item) => map.set(item.id.toString(), item.text));
        return map;
    }, [question.orderItems]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = currentOrder.indexOf(active.id as string);
            const newIndex = currentOrder.indexOf(over.id as string);
            const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
            dispatch(setIdBasedAnswer({ questionId: question.id.toString(), optionIds: newOrder }));
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">Drag items to reorder them.</p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2">
                        {currentOrder.map((id) => (
                            <SortableItem key={id} id={id} text={itemMap.get(id) ?? ''} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
