
import { ImageIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { FileUploaderSheet } from '@/components/FileUploaderSheet';
import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/react';

export default function MediaMenu({ editor }: { editor: Editor }) {
  const { id: articleId } = useParams();
  
  const onUploadComplete = (url: string, text?: string) => {
    if (!editor || !url) return;
    
    // Insert the image into the editor
    editor
      .chain()
      .focus()
      .setImage({ src: url, alt: text || 'Image' })
      .run();
  };

  const trigger = (
    <Button variant="ghost" size="icon" className="h-8 w-8" title="Image">
      <ImageIcon className="h-4 w-4" />
    </Button>
  );

  return <FileUploaderSheet {...{ trigger }} {...{ onUploadComplete }} articleId={articleId} />;
}
