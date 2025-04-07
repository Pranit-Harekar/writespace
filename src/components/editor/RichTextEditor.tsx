import React, { useEffect, useRef } from 'react';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface FullEditorProps {
  initialValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  editorInstance?: Editor | null;
}

const RichTextEditor: React.FC<FullEditorProps> = ({
  initialValue,
  onValueChange,
  className = 'prose prose-lg max-w-none outline-hidden min-h-[50vh] text-md',
  editorInstance,
}) => {
  // Track if we should update content from initialValue
  const shouldUpdateFromProps = useRef(true);
  const lastContent = useRef(initialValue);

  // Only create a local editor if no external editor is provided
  const localEditor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: 'font-sans',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'my-4',
          },
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
        autolink: false,
        linkOnPaste: true,
        protocols: ['http', 'https'],
        validate: url =>
          /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-]$/.test(url),
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder,
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastContent.current = html;
      onValueChange(html);

      // After initial load and first update, don't automatically update from props anymore
      // unless there's a significant difference
      if (html !== initialValue) {
        shouldUpdateFromProps.current = false;
      }
    },
    editorProps: {
      attributes: {
        class: `${className} focus:outline-hidden`,
      },
    },
  });

  // Determine which editor to use
  const editor = editorInstance || localEditor;

  // Use visibility change to preserve content
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && editor) {
        // When coming back to the page, ensure editor has latest content
        const currentHTML = editor.getHTML();
        if (currentHTML !== lastContent.current) {
          editor.commands.setContent(lastContent.current);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [editor]);

  // Handle initialValue changes, but be careful about overwriting user edits
  useEffect(() => {
    // Only update from props if we haven't edited yet or there's a significant change
    if (editor && shouldUpdateFromProps.current && initialValue !== editor.getHTML()) {
      editor.commands.setContent(initialValue);
      lastContent.current = initialValue;
    }
  }, [initialValue, editor]);

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className={`${className} focus:outline-hidden ProseMirror font-serif text-lg`}
      />
    </div>
  );
};

export default RichTextEditor;
