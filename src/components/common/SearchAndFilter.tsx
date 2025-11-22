import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchAndFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<{
    key: string;
    value: string;
    options: FilterOption[];
    placeholder: string;
    onChange: (value: string) => void;
  }>;
  className?: string;
}

export function SearchAndFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  className = "",
}: SearchAndFilterProps) {
  return (
    <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
      <div className="flex items-center gap-2 flex-1">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      {filters.length > 0 && (
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={filter.value || "ALL"}
              onValueChange={(value) => filter.onChange(value === "ALL" ? "" : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All {filter.placeholder}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}
    </div>
  );
}

