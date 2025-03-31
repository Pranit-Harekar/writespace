
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface PlainTextEditorProps {
  initialValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  tagName?: string;
}

const TipTapPlainTextEditor: React.FC<PlainTextEditorProps> = ({
  initialValue,
  onValueChange,
  placeholder = '',
  className = '',
  tagName = 'p',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        horizontalRule: false,
        code: false,
        codeBlock: false,
        hardBreak: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      // Get plain text content
      const plainText = editor.getText();
      onValueChange(plainText);
    },
    editorProps: {
      attributes: {
        class: className,
      },
    },
  });

  // Update content when initialValue changes
  useEffect(() => {
    if (editor && initialValue !== editor.getText()) {
      editor.commands.setContent(initialValue);
    }
  }, [initialValue, editor]);

  return (
    <EditorContent editor={editor} />
  );
};

export default TipTapPlainTextEditor;
