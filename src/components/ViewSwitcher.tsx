
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid2X2, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center justify-end mb-4">
      <ToggleGroup type="single" value={currentView} onValueChange={(value: ViewMode) => value && onViewChange(value)}>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <Grid2X2 className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
