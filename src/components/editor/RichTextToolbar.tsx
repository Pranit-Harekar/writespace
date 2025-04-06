
import React, { memo } from 'react';
import { Separator } from '@/components/ui/separator';
import { Editor } from '@tiptap/react';

import BlockMenu from './menu-items/BlockMenu';
import AlignMenu from './menu-items/format/AlignMenu';
import ListMenu from './menu-items/format/ListMenu';
import MarksMenu from './menu-items/format/MarksMenu';
import TextStyleMenu from './menu-items/format/TextStyleMenu';
import HistoryMenu from './menu-items/history/HistoryMenu';
import LinkEditor from './menu-items/link/LinkEditor';
import MediaMenu from './menu-items/media/MediaMenu';
import MoreMenu from './menu-items/MoreMenu';

interface RichTextToolbarProps {
  editor: Editor | null;
}

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap items-center p-1 border-b gap-1">
      <HistoryMenu editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <TextStyleMenu editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <MarksMenu editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <AlignMenu editor={editor} />
      <ListMenu editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <LinkEditor editor={editor} />
      <BlockMenu editor={editor} />
      <MediaMenu editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <MoreMenu editor={editor} />
    </div>
  );
};

// Memoize the toolbar to prevent unnecessary re-renders
export default memo(RichTextToolbar);
