
import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Image,
  Headphones,
  Video,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  ChevronDown,
  RemoveFormatting,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';

interface RichTextToolbarProps {
  editor: Editor | null;
}

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const handleFormatText = (format: string) => {
    if (!editor) return;

    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'strikethrough':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'clearFormatting':
        editor.chain().focus().clearNodes().unsetAllMarks().run();
        break;
      case 'heading1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      default:
        break;
    }
  };

  const handleInsertMedia = (type: string) => {
    if (!editor) return;

    switch (type) {
      case 'link': {
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
        break;
      }
      case 'image': {
        const imageUrl = prompt('Enter image URL:', 'https://');
        if (imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
        break;
      }
      case 'button': {
        const btnText = prompt('Button text:', 'Click me');
        const btnUrl = prompt('Button URL:', 'https://');
        if (btnText && btnUrl) {
          editor.chain().focus().setLink({ href: btnUrl }).insertContent(`<a href="${btnUrl}" class="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 my-2" target="_blank" rel="noopener noreferrer">${btnText}</a>`).run();
        }
        break;
      }
      case 'video': {
        const videoUrl = prompt('Enter video URL (YouTube, Vimeo, etc.):', 'https://');
        if (videoUrl) {
          editor.chain().focus().insertContent(`<div class="border-2 border-dashed border-gray-300 p-4 text-center bg-gray-50 my-4"><p>Video: ${videoUrl}</p></div>`).run();
        }
        break;
      }
      case 'audio': {
        const audioUrl = prompt('Enter audio URL:', 'https://');
        if (audioUrl) {
          editor.chain().focus().insertContent(`<div class="border-2 border-dashed border-gray-300 p-4 text-center bg-gray-50 my-4"><p>Audio: ${audioUrl}</p></div>`).run();
        }
        break;
      }
      default:
        break;
    }
  };

  const handleAlignText = (alignment: string) => {
    if (!editor) return;

    switch (alignment) {
      case 'left':
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'center':
        editor.chain().focus().setTextAlign('center').run();
        break;
      case 'right':
        editor.chain().focus().setTextAlign('right').run();
        break;
      case 'justify':
        editor.chain().focus().setTextAlign('justify').run();
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center p-1 border-b gap-1 overflow-x-auto">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Menubar className="border-none p-0">
        <MenubarMenu>
          <MenubarTrigger className="font-normal px-3 flex items-center">
            Style
            <ChevronDown className="h-4 w-4 ml-1" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => handleFormatText('heading1')}>Heading 1</MenubarItem>
            <MenubarItem onSelect={() => handleFormatText('heading2')}>Heading 2</MenubarItem>
            <MenubarItem onSelect={() => handleFormatText('heading3')}>Heading 3</MenubarItem>
            <MenubarItem onSelect={() => handleFormatText('paragraph')}>Paragraph</MenubarItem>
            <MenubarItem onSelect={() => handleFormatText('blockquote')}>Blockquote</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFormatText('bold')}
        className={`h-8 w-8 ${editor.isActive('bold') ? 'bg-secondary' : ''}`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFormatText('italic')}
        className={`h-8 w-8 ${editor.isActive('italic') ? 'bg-secondary' : ''}`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFormatText('strikethrough')}
        className={`h-8 w-8 ${editor.isActive('strike') ? 'bg-secondary' : ''}`}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFormatText('code')}
        className={`h-8 w-8 ${editor.isActive('code') ? 'bg-secondary' : ''}`}
        title="Code"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFormatText('clearFormatting')}
        className="h-8 w-8"
        title="Clear Formatting"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleInsertMedia('link')}
        className={`h-8 w-8 ${editor.isActive('link') ? 'bg-secondary' : ''}`}
        title="Link"
      >
        <Link className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleInsertMedia('image')}
        className="h-8 w-8"
        title="Image"
      >
        <Image className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleInsertMedia('audio')}
        className="h-8 w-8"
        title="Audio"
      >
        <Headphones className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleInsertMedia('video')}
        className="h-8 w-8"
        title="Video"
      >
        <Video className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFormatText('bulletList')}
        className={`h-8 w-8 ${editor.isActive('bulletList') ? 'bg-secondary' : ''}`}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleFormatText('orderedList')}
        className={`h-8 w-8 ${editor.isActive('orderedList') ? 'bg-secondary' : ''}`}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Menubar className="border-none p-0">
        <MenubarMenu>
          <MenubarTrigger className="font-normal px-3 flex items-center">
            Button
            <ChevronDown className="h-4 w-4 ml-1" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => handleInsertMedia('button')}>Insert Button</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Menubar className="border-none p-0">
        <MenubarMenu>
          <MenubarTrigger className="font-normal px-3 flex items-center">
            More
            <ChevronDown className="h-4 w-4 ml-1" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => handleAlignText('left')}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Align Left
            </MenubarItem>
            <MenubarItem onSelect={() => handleAlignText('center')}>
              <AlignCenter className="h-4 w-4 mr-2" />
              Align Center
            </MenubarItem>
            <MenubarItem onSelect={() => handleAlignText('right')}>
              <AlignRight className="h-4 w-4 mr-2" />
              Align Right
            </MenubarItem>
            <MenubarItem onSelect={() => handleAlignText('justify')}>
              <AlignJustify className="h-4 w-4 mr-2" />
              Justify
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default RichTextToolbar;
