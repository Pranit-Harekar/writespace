
import React, { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Link, Unlink } from 'lucide-react';
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
      if (!editor) return;

      // If there's already a link, update it
      if (editor.isActive('link')) {
        // First update the URL
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: link })
          .run();

        // If the text should also change and it's different from the current text
        if (text && text !== editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          ' '
        )) {
          // Replace the selected text (which should be the link text now)
          editor
            .chain()
            .focus()
            .deleteSelection()
            .insertContent(text)
            .setLink({ href: link })
            .run();
        }
        return;
      }

      // Case: We have selected text, just need to make it a link
      if (editor.state.selection.content().size > 0) {
        editor
          .chain()
          .focus()
          .setLink({ href: link })
          .run();
        return;
      }

      // Case: No selection, insert new link with text
      if (text) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'text',
            text: text,
            marks: [
              {
                type: 'link',
                attrs: { href: link },
              },
            ],
          })
          .run();
      }
    },
    [editor],
  );

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  }, [editor]);

  const isLinkActive = editor?.isActive('link');

  const getSelectedText = useCallback(() => {
    if (!editor) return '';
    return editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Popover open={isLinkMenuOpen} onOpenChange={setIsLinkMenuOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${isLinkActive ? 'bg-secondary is-active' : ''}`}
          title="Link"
          onClick={() => {
            if (isLinkActive) {
              setInitialUrl(editor.getAttributes('link').href || '');
              setInitialText(getSelectedText());
            } else {
              const selectedText = getSelectedText();
              setInitialText(selectedText);
              setInitialUrl('');
            }
            setIsLinkMenuOpen(true);
          }}
        >
          <Link className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          {isLinkActive && (
            <div className="mb-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex gap-1 text-destructive hover:text-destructive/90"
                onClick={() => {
                  removeLink();
                  setIsLinkMenuOpen(false);
                }}
              >
                <Unlink className="h-4 w-4" />
                Remove Link
              </Button>
            </div>
          )}
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
            isEditMode={isLinkActive}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkEditor;
