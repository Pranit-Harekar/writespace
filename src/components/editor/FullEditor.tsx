
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import RichTextToolbar from '../RichTextToolbar';

interface FullEditorProps {
  initialValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const FullEditor: React.FC<FullEditorProps> = ({
  initialValue,
  onValueChange,
  placeholder = 'Start writing...',
  className = 'prose prose-lg max-w-none outline-none min-h-[50vh] text-md',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      onValueChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: className,
      },
    },
  });

  // Update content when initialValue changes
  useEffect(() => {
    if (editor && initialValue !== editor.getHTML()) {
      editor.commands.setContent(initialValue);
    }
  }, [initialValue, editor]);

  return (
    <div className="bg-white border rounded-md shadow-sm">
      <RichTextToolbar />
      <div className="p-4">
        <EditorContent editor={editor} className={className} />
      </div>
    </div>
  );
};

export default FullEditor;
