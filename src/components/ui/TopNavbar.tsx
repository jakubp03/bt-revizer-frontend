import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn_ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { handleLogout } from "@/store/slices/authSlice";
import { BookOpen, FolderPlus, LogOut, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopNavbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(handleLogout());
    };

    return (
        <header className="flex h-14 w-full shrink-0 items-center justify-end gap-2 bg-background px-4">
            {/* Create (+) dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="Create new"
                    >
                        <Plus size={22} strokeWidth={2.5} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onClick={() => navigate("/quiz/create")}
                    >
                        <BookOpen size={16} className="text-primary" />
                        Quiz
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onClick={() => navigate("/category/create")}
                    >
                        <FolderPlus size={16} className="text-primary" />
                        Category
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow transition-colors hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="User menu"
                    >
                        <User size={20} strokeWidth={2} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    {user?.name && (
                        <>
                            <div className="px-2 py-1.5">
                                <p className="text-sm font-medium">{user.name}</p>
                                {user.email && (
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                )}
                            </div>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer gap-2"
                        onClick={onLogout}
                    >
                        <LogOut size={16} />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
