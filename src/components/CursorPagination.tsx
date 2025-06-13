import { cn } from "@/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";

export interface CursorPaginationProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNext: () => void;
  onPrevious: () => void;
  currentCount: number;
  totalCount: number;
  itemName?: string;
  className?: string;
  isLoading?: boolean;
  pageSize?: number;
}

export function CursorPagination({
  hasNextPage,
  hasPreviousPage,
  onNext,
  onPrevious,
  currentCount,
  totalCount,
  className,
  isLoading = false,
}: CursorPaginationProps) {
  if (!hasNextPage && !hasPreviousPage) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex justify-between items-center pt-8 border-t border-zinc-800/50",
        className,
      )}
    >
      <Button
        onClick={onPrevious}
        disabled={!hasPreviousPage || isLoading}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="text-center">
        <div className="text-sm text-zinc-400">
          Showing{" "}
          <span className="font-medium text-zinc-200">
            {currentCount.toLocaleString()}
          </span>{" "}
          of{" "}
          <span className="font-medium text-zinc-200">
            {totalCount.toLocaleString()}
          </span>
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!hasNextPage || isLoading}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
