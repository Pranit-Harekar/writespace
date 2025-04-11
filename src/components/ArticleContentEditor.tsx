import React, { useRef } from 'react';

import useSharedEditor from '@/hooks/useSharedEditor';

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
  const editor = useSharedEditor({ initialContent, onContentChange });

  return (
    <div className="">
      <div className="px-8 max-w-4xl mx-auto flex flex-col gap-8" ref={contentRef}>
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900">
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

        <div className="relative mb-10">
          <RichTextEditor
            className="prose prose-lg max-w-none outline-hidden focus:outline-hidden min-h-[50vh] text-md relative"
            editorInstance={editor}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleContentEditor;
