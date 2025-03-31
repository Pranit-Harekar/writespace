
import React from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'

interface RichTextToolbarProps {
  onFormatText: (format: string) => void
  onInsertMedia: (type: string) => void
  onAlignText: (alignment: string) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({
  onFormatText,
  onInsertMedia,
  onAlignText,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="flex items-center p-1 border-b gap-1 overflow-x-auto">
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        className="h-8 w-8"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
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
            <MenubarItem onSelect={() => onFormatText('heading1')}>Heading 1</MenubarItem>
            <MenubarItem onSelect={() => onFormatText('heading2')}>Heading 2</MenubarItem>
            <MenubarItem onSelect={() => onFormatText('heading3')}>Heading 3</MenubarItem>
            <MenubarItem onSelect={() => onFormatText('paragraph')}>Paragraph</MenubarItem>
            <MenubarItem onSelect={() => onFormatText('blockquote')}>Blockquote</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormatText('bold')}
        className="h-8 w-8"
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormatText('italic')}
        className="h-8 w-8"
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormatText('strikethrough')}
        className="h-8 w-8"
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormatText('code')}
        className="h-8 w-8"
        title="Code"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormatText('clearFormatting')}
        className="h-8 w-8"
        title="Clear Formatting"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsertMedia('link')}
        className="h-8 w-8"
        title="Link"
      >
        <Link className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsertMedia('image')}
        className="h-8 w-8"
        title="Image"
      >
        <Image className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsertMedia('audio')}
        className="h-8 w-8"
        title="Audio"
      >
        <Headphones className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsertMedia('video')}
        className="h-8 w-8"
        title="Video"
      >
        <Video className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormatText('bulletList')}
        className="h-8 w-8"
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormatText('orderedList')}
        className="h-8 w-8"
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
            <MenubarItem onSelect={() => onInsertMedia('button')}>Insert Button</MenubarItem>
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
            <MenubarItem onSelect={() => onAlignText('left')}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Align Left
            </MenubarItem>
            <MenubarItem onSelect={() => onAlignText('center')}>
              <AlignCenter className="h-4 w-4 mr-2" />
              Align Center
            </MenubarItem>
            <MenubarItem onSelect={() => onAlignText('right')}>
              <AlignRight className="h-4 w-4 mr-2" />
              Align Right
            </MenubarItem>
            <MenubarItem onSelect={() => onAlignText('justify')}>
              <AlignJustify className="h-4 w-4 mr-2" />
              Justify
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export default RichTextToolbar
