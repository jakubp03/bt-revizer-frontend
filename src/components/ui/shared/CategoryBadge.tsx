import { Badge } from "@/components/ui/shadcn_ui/badge";
import { selectCategoryById } from "@/store/slices/categorySlice";
import { useSelector } from "react-redux";

export default function CategoryBadge({ categoryId }: { categoryId: string }) {
    const category = useSelector(selectCategoryById(categoryId));
    if (!category) return null;

    return (
        <Badge
            className="truncate border-none text-white"
            style={{ backgroundColor: category.color }}
            title={category.name}
        >
            {category.name}
        </Badge>
    );
}
