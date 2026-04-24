import { Input } from '@/components/ui/shadcn_ui/input';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { OrderingForm } from '../../../../../../types/quizCreationTypes';
import { createOrderItem } from '../../../../../../types/quizCreationTypes';

interface Props {
    question: OrderingForm;
    onChange: (updated: OrderingForm) => void;
}

export default function OrderingEditor({ question, onChange }: Props) {
    const updateItem = (clientId: string, text: string) => {
        onChange({
            ...question,
            items: question.items.map((i) => (i.clientId === clientId ? { ...i, text } : i)),
        });
    };

    const moveItem = (index: number, direction: -1 | 1) => {
        const newItems = [...question.items];
        const target = index + direction;
        if (target < 0 || target >= newItems.length) return;
        [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
        onChange({ ...question, items: newItems });
    };

    const addItem = () => {
        onChange({ ...question, items: [...question.items, createOrderItem()] });
    };

    const removeItem = (clientId: string) => {
        if (question.items.length <= 2) return;
        onChange({ ...question, items: question.items.filter((i) => i.clientId !== clientId) });
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Add items in the correct order</span>
            {question.items.map((item, index) => (
                <div key={item.clientId} className="flex items-center gap-2">
                    <span className="w-5 shrink-0 text-center text-xs text-muted-foreground">
                        {index + 1}.
                    </span>
                    <Input
                        value={item.text}
                        onChange={(e) => updateItem(item.clientId, e.target.value)}
                        placeholder="Item text"
                        className="flex-1"
                    />
                    <div className="flex items-center gap-0.5">
                        <button
                            type="button"
                            onClick={() => moveItem(index, -1)}
                            disabled={index === 0}
                            className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground hover:cursor-pointer disabled:pointer-events-none disabled:opacity-30"
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => moveItem(index, 1)}
                            disabled={index === question.items.length - 1}
                            className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground hover:cursor-pointer disabled:pointer-events-none disabled:opacity-30"
                        >
                            <ChevronDown size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => removeItem(item.clientId)}
                            disabled={question.items.length <= 2}
                            className="ml-0.5 text-muted-foreground transition-colors hover:text-destructive hover:cursor-pointer disabled:pointer-events-none disabled:opacity-30"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="mt-1 self-start text-sm text-primary hover:text-primary/70 transition-colors hover:cursor-pointer"
            >
                + Add item
            </button>
        </div>
    );
}
