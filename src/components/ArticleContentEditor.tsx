
import React, { useRef } from 'react';
import TipTapPlainTextEditor from './editor/TipTapPlainTextEditor';
import FullEditor from './editor/FullEditor';

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

  return (
    <div className="bg-white">
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

        <FullEditor
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
