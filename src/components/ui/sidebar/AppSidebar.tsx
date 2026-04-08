import logo from "@/assets/logo.svg";
import { Separator } from "@/components/ui/shadcn_ui/separator";
import { cn } from "@/lib/utils";
import { FolderOpen, History, Home, Library, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

type NavItem = {
    label: string;
    icon: ReactNode;
    href: string;
};

const navItems: NavItem[] = [
    { label: "Home", icon: <Home size={20} />, href: "/" },
    { label: "History", icon: <History size={20} />, href: "/history" },
    { label: "Library", icon: <Library size={20} />, href: "/library" },
];

// Mock categories — replace with real data later
const mockCategories = [{ id: "1", name: "Biology" }];

export default function AppSidebar() {
    const location = useLocation();

    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
            {/* Logo & title */}
            <div className="flex items-center gap-3 px-2 py-3">
                <img src={logo} alt="Revizer logo" className="h-12 w-12 p-0" />
                <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
                    Revizer
                </span>
            </div>

            <Separator className="mx-3 w-auto bg-sidebar-border" />

            {/* Main navigation */}
            <nav className="flex flex-col gap-1 p-3">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <Separator className="mx-3 w-auto bg-sidebar-border" />

            {/* Categories section */}
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                <span className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your categories
                </span>

                {mockCategories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            location.pathname === `/category/${category.id}`
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                    >
                        <FolderOpen size={20} />
                        {category.name}
                    </Link>
                ))}

                <button
                    type="button"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                    <Plus size={20} />
                    New category
                </button>
            </div>
        </aside>
    );
}
