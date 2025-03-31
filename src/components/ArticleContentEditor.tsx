
import React, { useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import RichTextToolbar from './RichTextToolbar';
import TipTapEditor from './editor/TipTapEditor';
import TipTapPlainTextEditor from './editor/TipTapPlainTextEditor';

interface ArticleContentEditorProps {
  initialContent: string;
  initialTitle: string;
  initialSubtitle: string;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
}

const ArticleContentEditor: React.FC<ArticleContentEditorProps> = ({
  initialContent,
  initialTitle,
  initialSubtitle,
  onContentChange,
  onTitleChange,
  onSubtitleChange,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  return (
    <div className="bg-white">
      <RichTextToolbar editor={editor} />
      <div className="py-6 px-8 max-w-4xl mx-auto flex flex-col gap-8" ref={contentRef}>
        <TipTapPlainTextEditor
          initialValue={initialTitle}
          onValueChange={onTitleChange}
          placeholder="Title"
          className="text-4xl font-bold outline-none relative"
          tagName="h1"
        />

        <TipTapPlainTextEditor
          initialValue={initialSubtitle}
          onValueChange={onSubtitleChange}
          placeholder="Add a subtitle..."
          className="text-lg text-gray-500 outline-none relative"
          tagName="p"
        />

        <TipTapEditor
          initialValue={initialContent}
          onValueChange={onContentChange}
          placeholder="Start writing..."
          className="prose prose-lg max-w-none outline-none min-h-[50vh] text-md"
        />
      </div>
    </div>
  );
};

export default ArticleContentEditor;
