import React from 'react';

import { Editor, EditorContent } from '@tiptap/react';

interface FullEditorProps {
  className?: string;
  editorInstance: Editor;
}

const RichTextEditor: React.FC<FullEditorProps> = ({
  className = 'prose prose-lg max-w-none outline-hidden min-h-[50vh] text-md',
  editorInstance,
}) => {
  return (
    <div className="relative">
      <EditorContent
        editor={editorInstance}
        className={`${className} focus:outline-hidden ProseMirror font-serif text-lg`}
      />
    </div>
  );
};

export default RichTextEditor;
