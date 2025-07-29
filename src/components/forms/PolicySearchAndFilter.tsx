import React, { useState, useCallback, useMemo } from 'react';
import { Search, Filter, X, Calendar, Tag, Archive, FileText, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { POLICY_CATEGORIES, POLICY_STATUSES } from '@/lib/validations/policyValidation';
import type { PolicyFilters } from '@/types/serviceTypes';

interface PolicySearchAndFilterProps {
  filters: PolicyFilters;
  onFiltersChange: (filters: PolicyFilters) => void;
  totalResults?: number;
  isLoading?: boolean;
  availableTags?: string[];
  className?: string;
}

const PolicySearchAndFilter: React.FC<PolicySearchAndFilterProps> = ({
  filters,
  onFiltersChange,
  totalResults = 0,
  isLoading = false,
  availableTags = [],
  className
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: filters.dateRange?.from,
    to: filters.dateRange?.to
  });

  // Debounce search input
  const debouncedSearch = useDebounce(searchValue, 300);

  // Update filters when debounced search changes
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({
        ...filters,
        search: debouncedSearch || undefined
      });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleCategoryChange = useCallback((category: string) => {
    onFiltersChange({
      ...filters,
      category: category === 'all' ? undefined : category as any
    });
  }, [filters, onFiltersChange]);

  const handleStatusChange = useCallback((status: string) => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? undefined : status as any
    });
  }, [filters, onFiltersChange]);

  const handleTagToggle = useCallback((tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined
    });
  }, [filters, onFiltersChange]);

  const handleDateRangeChange = useCallback((range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    onFiltersChange({
      ...filters,
      dateRange: range.from && range.to ? range : undefined
    });
  }, [filters, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    setSearchValue('');
    setDateRange({});
    onFiltersChange({});
  }, [onFiltersChange]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.status) count++;
    if (filters.tags?.length) count++;
    if (filters.dateRange) count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search policies by title or content..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Quick Filters */}
        <div className="flex items-center gap-2">
          <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {POLICY_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {POLICY_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center gap-2">
                    {status === 'active' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                    {status === 'draft' && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
                    {status === 'archived' && <div className="w-2 h-2 bg-gray-500 rounded-full" />}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Toggle */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Advanced Filters</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => handleDateRangeChange(range || {})}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Tags Filter */}
              {availableTags.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {availableTags.map((tag) => {
                      const isSelected = filters.tags?.includes(tag);
                      return (
                        <Badge
                          key={tag}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleTagToggle(tag)}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          {isSelected && <X className="w-3 h-3 ml-1" />}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-500 ml-auto">
          {isLoading ? (
            <span>Searching...</span>
          ) : (
            <span>{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                <Search className="w-3 h-3" />
                "{filters.search}"
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => {
                    setSearchValue('');
                    onFiltersChange({ ...filters, search: undefined });
                  }}
                />
              </Badge>
            )}
            
            {filters.category && (
              <Badge variant="secondary" className="gap-1">
                <FileText className="w-3 h-3" />
                {filters.category}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => handleCategoryChange('all')}
                />
              </Badge>
            )}
            
            {filters.status && (
              <Badge variant="secondary" className="gap-1">
                <Archive className="w-3 h-3" />
                {filters.status}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => handleStatusChange('all')}
                />
              </Badge>
            )}
            
            {filters.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                <Tag className="w-3 h-3" />
                {tag}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => handleTagToggle(tag)}
                />
              </Badge>
            ))}
            
            {filters.dateRange && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="w-3 h-3" />
                {format(filters.dateRange.from, "MMM dd")} - {format(filters.dateRange.to, "MMM dd")}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => handleDateRangeChange({})}
                />
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PolicySearchAndFilter;
