import React from "react";
import AppSidebar from "./sidebar/AppSidebar";

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto bg-background p-6">
                {children}
            </main>
        </div>
    );
}
