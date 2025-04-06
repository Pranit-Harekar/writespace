import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Image as ImageIcon, Headphones, Video, Undo, Redo, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import LinkMediaDialog from './media/LinkMediaDialog';
import LinkEditor from './link/LinkEditor';
import TextStyleMenu from './format/TextStyleMenu';
import ListMenu from './format/ListMenu';
import AlignMenu from './format/AlignMenu';
import MarksMenu from './format/MarksMenu';
import HistoryMenu from './history/HistoryMenu';

interface RichTextToolbarProps {
  editor: Editor | null;
}

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ editor }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'image' | 'audio' | 'video' | 'button'>('image');

  if (!editor) {
    return null;
  }

  const openMediaDialog = (type: 'image' | 'audio' | 'video' | 'button') => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleMediaInsert = (url: string, text?: string) => {
    if (!editor || !url) return;

    switch (dialogType) {
      case 'image': {
        editor
          .chain()
          .focus()
          .setImage({ src: url, alt: text || 'Image' })
          .run();
        break;
      }
      case 'button': {
        const btnText = text || 'Click me';
        editor
          .chain()
          .focus()
          .insertContent(
            `<a href="${url}" class="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 my-2" target="_blank" rel="noopener noreferrer">${btnText}</a>`,
          )
          .run();
        break;
      }
      case 'video': {
        editor
          .chain()
          .focus()
          .insertContent(
            `<div class="border-2 border-dashed border-gray-300 p-4 text-center bg-gray-50 my-4"><p>Video: ${url}</p></div>`,
          )
          .run();
        break;
      }
      case 'audio': {
        editor
          .chain()
          .focus()
          .insertContent(
            `<div class="border-2 border-dashed border-gray-300 p-4 text-center bg-gray-50 my-4"><p>Audio: ${url}</p></div>`,
          )
          .run();
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="flex items-center p-1 border-b gap-1 overflow-x-auto">
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

      <Button
        variant="ghost"
        size="icon"
        onClick={() => openMediaDialog('image')}
        className="h-8 w-8"
        title="Image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => openMediaDialog('audio')}
        className="h-8 w-8"
        title="Audio"
      >
        <Headphones className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => openMediaDialog('video')}
        className="h-8 w-8"
        title="Video"
      >
        <Video className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Menubar className="border-none p-0">
        <MenubarMenu>
          <MenubarTrigger className="font-normal px-3 flex items-center">
            Button
            <ChevronDown className="h-4 w-4 ml-1" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => openMediaDialog('button')}>Insert Button</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <LinkMediaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleMediaInsert}
        type={dialogType}
      />
    </div>
  );
};

export default RichTextToolbar;
