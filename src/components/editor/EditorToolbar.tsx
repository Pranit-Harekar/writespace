import { ChevronLeft, Save } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { DeleteDialog } from '@/components/DeleteDialog';
import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  isEditing: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isLoading: boolean;
  onSave: () => void;
  onDelete: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isEditing,
  isSaving,
  isDeleting,
  isLoading,
  onSave,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex justify-between items-center">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-1">
        <ChevronLeft className="h-4 w-4" /> Back
      </Button>

      <div className="flex items-center gap-2">
        {isSaving && <span className="text-sm text-muted-foreground">Saving...</span>}
        <div className="flex gap-2">
          {isEditing && (
            <DeleteDialog
              title="Delete Article"
              message="Are you sure you want to delete this article? This action cannot be undone."
              {...{ onDelete }}
              {...{ isDeleting }}
              {...{ isLoading }}
            />
          )}
          <Button onClick={onSave} disabled={isLoading}>
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
};
