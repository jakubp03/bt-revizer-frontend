import { Loader2 } from 'lucide-react'

export default function LoadingSpinnerSmall() {
    return (
        <div className="flex items-center justify-center py-4">
            <Loader2 size={18} className="animate-spin text-muted-foreground" />
        </div>
    )
}
