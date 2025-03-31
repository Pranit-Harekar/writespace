
import React, { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

interface FullEditorProps {
  initialValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  editorInstance?: Editor | null;
}

const FullEditor: React.FC<FullEditorProps> = ({
  initialValue,
  onValueChange,
  placeholder = 'Start writing...',
  className = 'prose prose-lg max-w-none outline-none min-h-[50vh] text-md',
  editorInstance,
}) => {
  // Only create a local editor if no external editor is provided
  const localEditor = useEditor({
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
      }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      onValueChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `${className} focus:outline-none`,
      },
    },
  });

  // Determine which editor to use
  const editor = editorInstance || localEditor;

  // Update content when initialValue changes for local editor
  useEffect(() => {
    if (localEditor && initialValue !== localEditor.getHTML()) {
      localEditor.commands.setContent(initialValue);
    }
  }, [initialValue, localEditor]);

  // For external editor, ensure content matches initialValue
  useEffect(() => {
    if (editorInstance && initialValue !== editorInstance.getHTML()) {
      editorInstance.commands.setContent(initialValue);
    }
  }, [initialValue, editorInstance]);

  return <EditorContent editor={editor} className={`${className} focus:outline-none`} />;
};

export default FullEditor;
