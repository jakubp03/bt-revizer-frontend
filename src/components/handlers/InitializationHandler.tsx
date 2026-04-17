import { useAppDispatch } from '@/store/hooks';
import { fetchAllCategories } from '@/store/thunks/categoryThunks';
import { fetchAllQuizes } from '@/store/thunks/quizThunks';
import { useEffect, type ReactNode } from 'react';

export default function InitializationHandler({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchAllCategories());
        dispatch(fetchAllQuizes());
    }, [dispatch]);

    return children;
}
