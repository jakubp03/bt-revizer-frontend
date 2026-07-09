import BackButton from '@/components/ui/shared/BackButton';
import { FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from './CategoryForm';

export default function CategoryCreationView() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-6 p-6 pb-16 max-w-3xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-3">
                <BackButton />
                <div className="flex items-center gap-2">
                    <FolderPlus size={22} className="text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">New Category</h1>
                        <p className="text-sm text-muted-foreground">Fill in the details and assign quizzes</p>
                    </div>
                </div>
            </div>

            <CategoryForm onSuccess={() => navigate('/')} onCancel={() => navigate(-1)} />
        </div>
    );
}
