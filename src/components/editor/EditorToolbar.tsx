
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting || isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          )}
          <Button onClick={onSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
};
