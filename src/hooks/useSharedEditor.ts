import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import ImageResize from '@/components/editor/extensions/ImageResize';

interface UseSharedEditorConfigProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const useSharedEditor = ({ initialContent, onContentChange }: UseSharedEditorConfigProps) => {
  const editor = useEditor({
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
      ImageResize,
      Link.configure({
        autolink: false,
        linkOnPaste: true,
        openOnClick: false,
        validate: url =>
          /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-]$/.test(url),
        protocols: ['http', 'https'],
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none outline-hidden min-h-[50vh] text-md focus:outline-hidden relative',
      },
    },
  });

  return editor;
};

export default useSharedEditor;
