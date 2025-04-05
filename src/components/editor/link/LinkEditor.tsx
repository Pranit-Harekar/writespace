import React, { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Link, Unlink, ExternalLink } from 'lucide-react';
import LinkForm from './LinkForm';

interface LinkEditorProps {
  editor: Editor;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ editor }) => {
  const [initialUrl, setInitialUrl] = useState<string>('');
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (url) => {
      if (url.trim() === '' || url == null) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      try {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      } catch (e) {
        alert(e.message);
      }
    },
    [editor],
  );

  if (!editor) {
    return null;
  }

  return (
    <Popover open={isLinkMenuOpen} onOpenChange={setIsLinkMenuOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${editor.isActive('link') ? 'bg-secondary' : ''}`}
          title="Link"
          onClick={() => {
            setInitialUrl(editor.getAttributes('link').href);
            setIsLinkMenuOpen(true);
          }}
        >
          <Link className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <LinkForm
            initialValue={initialUrl}
            onCancel={() => setIsLinkMenuOpen(false)}
            onSubmit={(value) => {
              handleSubmit(value);
              setIsLinkMenuOpen(false);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkEditor;
