import React, { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';
import LinkForm, { LinkData } from './LinkForm';

interface LinkEditorProps {
  editor: Editor;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ editor }) => {
  const [initialText, setInitialText] = useState<string>('');
  const [initialUrl, setInitialUrl] = useState<string>('');
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState<boolean>(false);

  const handleSubmit = useCallback(
    ({ text, link }: LinkData) => {
      // todo: complete this
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
          className={`h-8 w-8 ${editor.isActive('link') ? 'bg-secondary is-active' : ''}`}
          title="Link"
          onClick={() => {
            setInitialUrl(editor.getAttributes('link').href);
            // todo
            // setInitialText();
            setIsLinkMenuOpen(true);
          }}
        >
          <Link className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <LinkForm
            initialValue={{
              text: initialText,
              link: initialUrl,
            }}
            onCancel={() => setIsLinkMenuOpen(false)}
            onSubmit={(values) => {
              handleSubmit(values);
              setIsLinkMenuOpen(false);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkEditor;
