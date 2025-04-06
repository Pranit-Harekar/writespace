import { Fragment, useEffect, useState } from 'react';

import { Separator } from '@/components/ui/separator';
import { Editor } from '@tiptap/react';
import { useIsMobile } from '@/hooks/use-mobile';

import BlockMenu from './menu-items/BlockMenu';
import AlignMenu from './menu-items/format/AlignMenu';
import ListMenu from './menu-items/format/ListMenu';
import MarksMenu from './menu-items/format/MarksMenu';
import TextStyleMenu from './menu-items/format/TextStyleMenu';
import HistoryMenu from './menu-items/history/HistoryMenu';
import LinkEditor from './menu-items/link/LinkEditor';
import MediaMenu from './menu-items/media/MediaMenu';
import MoreMenu from './menu-items/MoreMenu';

const VerticalSeparator = <Separator orientation="vertical" className="mx-1 h-6" />;

const RichTextToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const menuItemGroups = [
    <HistoryMenu key="history" editor={editor} />,
    VerticalSeparator,
    <TextStyleMenu key="text-style" editor={editor} />,
    VerticalSeparator,
    <MarksMenu key="marks" editor={editor} />,
    VerticalSeparator,
    <AlignMenu key="align" editor={editor} />,
    <ListMenu key="list" editor={editor} />,
    VerticalSeparator,
    <LinkEditor key="link-editor" editor={editor} />,
    <BlockMenu key="block-menu" editor={editor} />,
    <MediaMenu key="media-menu" editor={editor} />,
    VerticalSeparator,
    <MoreMenu key="more-menu" editor={editor} />,
  ];

  return <div className="flex flex-wrap items-center p-1 border-b gap-1">{menuItemGroups}</div>;
};

export default RichTextToolbar;
