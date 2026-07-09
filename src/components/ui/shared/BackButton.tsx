import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Props = {
    delta?: number;
};

export default function BackButton({ delta = -1 }: Props) {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            onClick={() => navigate(delta)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:cursor-pointer"
        >
            <ArrowLeft size={20} />
        </button>
    );
}
