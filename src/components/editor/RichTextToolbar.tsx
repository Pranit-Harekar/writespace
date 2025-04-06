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
  const isMobile = useIsMobile();

  if (!editor) {
    return null;
  }

  // Group menu items for better organization
  const historyGroup = [<HistoryMenu key="history" editor={editor} />];

  const textGroup = [
    <TextStyleMenu key="text-style" editor={editor} />,
    <MarksMenu key="marks" editor={editor} />,
  ];

  const formatGroup = [
    <AlignMenu key="align" editor={editor} />,
    <ListMenu key="list" editor={editor} />,
  ];

  const insertGroup = [
    <LinkEditor key="link-editor" editor={editor} />,
    <BlockMenu key="block-menu" editor={editor} />,
    <MediaMenu key="media-menu" editor={editor} />,
  ];

  const moreGroup = [<MoreMenu key="more-menu" editor={editor} />];

  // Combine all groups with separators for the toolbar
  const menuItemGroups = [
    { key: 'history', items: historyGroup },
    { key: 'text', items: textGroup },
    { key: 'format', items: formatGroup },
    { key: 'insert', items: insertGroup },
    { key: 'more', items: moreGroup },
  ];

  return (
    <div className="flex flex-wrap items-center p-1 border-b gap-1 bg-white">
      {menuItemGroups.map((group, groupIndex) => (
        <Fragment key={group.key}>
          <div className="flex items-center flex-wrap">
            {group.items.map((item, itemIndex) => (
              <Fragment key={`${group.key}-${itemIndex}`}>{item}</Fragment>
            ))}
          </div>
          {groupIndex < menuItemGroups.length - 1 &&
            (isMobile ? (
              groupIndex < menuItemGroups.length - 1 && <div className="w-full my-1"></div>
            ) : (
              <Separator orientation="vertical" className="mx-2 h-6" />
            ))}
        </Fragment>
      ))}
    </div>
  );
};

export default RichTextToolbar;
