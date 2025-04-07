import React, { useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '@/lib/storage';

export type ViewMode = 'grid' | 'list';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  // Update localStorage when view changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.VIEW_MODE, currentView);
  }, [currentView]);

  return (
    <div className="flex items-center justify-end mb-4">
      <ToggleGroup
        type="single"
        value={currentView}
        onValueChange={(value: ViewMode) => value && onViewChange(value)}
      >
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <LayoutList className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

// Helper function to get the persisted view mode from localStorage
export const getPersistedViewMode = (): ViewMode => {
  return getStorageItem<ViewMode>(STORAGE_KEYS.VIEW_MODE, 'list');
};
