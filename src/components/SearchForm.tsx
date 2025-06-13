import { cn } from "@/utils/cn";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { LoadingSpinner } from "./ui/LoadingSpinner";

export interface SearchFormProps {
  onSearch: (owner: string, name: string) => void;
  initialValue?: string;
  isLoading?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function SearchForm({
  onSearch,
  initialValue = "",
  isLoading = false,
  error,
  placeholder = "Search repositories (e.g., oven-sh/bun)...",
  className,
}: SearchFormProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const [owner, name] = query.trim().split("/");
      if (owner && name) {
        onSearch(owner, name);
      }
    }
  };

  const isValidFormat = query.includes("/") && query.split("/").length === 2;

  return (
    <div className={cn("space-y-3", className)}>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={!query.trim() || !isValidFormat || isLoading}
          className="px-6 min-w-[120px]"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size={16} className="mr-2" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </form>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-md">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {query && !isValidFormat && (
        <div className="p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-md">
          <p className="text-yellow-300 text-sm">
            Please enter repository in format: owner/name (e.g., oven-sh/bun)
          </p>
        </div>
      )}
    </div>
  );
}
