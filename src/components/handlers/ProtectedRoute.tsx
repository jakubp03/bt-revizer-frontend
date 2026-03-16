import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../../store/hooks";

type Props = {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
    const { token, isValidating } = useAppSelector(state => state.auth);

    if (isValidating) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span
                    className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
                    aria-label="Validating session"
                />
            </div>
        );
    }

    if (token === null) {
        return <Navigate to="/login" replace />
    }

    return children;
}
