
import React, { useRef } from 'react';

import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import PlainTextEditor from './editor/PlainTextEditor';
import RichTextEditor from './editor/RichTextEditor';
import RichTextToolbar from './editor/RichTextToolbar';

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

  // Create a shared editor for the toolbar that will control the content editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: 'font-sans',
          },
        },
      }),
      Image,
      Link.configure({
        autolink: false,
        linkOnPaste: true,
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-orange-500 underline hover:text-orange-600',
        },
        validate: (url) =>
          /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-]$/.test(url),
        protocols: ['http', 'https'],
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder,
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-4',
        },
      }),
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

  return (
    <div className="bg-white">
      <div className="px-8 max-w-4xl mx-auto flex flex-col gap-8" ref={contentRef}>
        <div className="sticky top-0 z-10 bg-white">
          <RichTextToolbar editor={editor} />
        </div>

        <PlainTextEditor
          initialValue={initialTitle}
          onValueChange={onTitleChange}
          placeholder="Title"
          className="text-4xl font-bold outline-hidden focus:outline-hidden relative"
          tagName="h1"
        />

        <PlainTextEditor
          initialValue={initialSubtitle}
          onValueChange={onSubtitleChange}
          placeholder="Subtitle"
          className="text-lg text-gray-500 outline-hidden focus:outline-hidden relative"
          tagName="p"
        />

        <div className="relative">
          <RichTextEditor
            initialValue={initialContent}
            onValueChange={onContentChange}
            className="prose prose-lg max-w-none outline-hidden focus:outline-hidden min-h-[50vh] text-md relative"
            editorInstance={editor}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleContentEditor;
