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

const RichTextToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-wrap items-center p-1 border-b gap-1">
      <HistoryMenu key="history" editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <TextStyleMenu key="text-style" editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <MarksMenu key="marks" editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <AlignMenu key="align" editor={editor} />
      <ListMenu key="list" editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <LinkEditor key="link-editor" editor={editor} />
      <BlockMenu key="block-menu" editor={editor} />
      <MediaMenu key="media-menu" editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <MoreMenu key="more-menu" editor={editor} />
    </div>
  );
};

export default RichTextToolbar;
