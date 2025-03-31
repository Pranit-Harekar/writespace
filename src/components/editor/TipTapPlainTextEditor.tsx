
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';

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
      TextAlign.configure({
        types: ['paragraph'],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: `<${tagName}>${initialValue || ''}</${tagName}>`,
    onUpdate: ({ editor }) => {
      // Get plain text content
      const plainText = editor.getText();
      onValueChange(plainText);
    },
    editorProps: {
      attributes: {
        class: `${className} focus:outline-none`,
      },
    },
  });

  // Update content when initialValue changes
  useEffect(() => {
    if (editor && initialValue !== editor.getText()) {
      editor.commands.setContent(`<${tagName}>${initialValue || ''}</${tagName}>`);
    }
  }, [initialValue, editor, tagName]);

  return (
    <EditorContent editor={editor} className={`${className} focus:outline-none`} />
  );
};

export default TipTapPlainTextEditor;
