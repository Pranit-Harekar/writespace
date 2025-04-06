import { ImageIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/react';

import MediaDialog from './MediaDialog';

export default function MediaMenu({ editor }: { editor: Editor }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMediaInsert = (url: string, text?: string) => {
    if (!editor || !url) return;
    editor
      .chain()
      .focus()
      .setImage({ src: url, alt: text || 'Image' })
      .run();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setDialogOpen(true)}
        className="h-8 w-8"
        title="Image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <MediaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleMediaInsert}
        type="image"
      />
    </>
  );
}
