import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ChevronDown } from 'lucide-react';

type StyleOptions = 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Paragraph' | 'Blockquote';

export default function StyleMenu({ editor }) {
  const handleStyle = (option: StyleOptions) => {
    if (!editor) return;

    switch (option) {
      case 'Heading 1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'Heading 2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'Heading 3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'Paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'Blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
    }
  };

  return (
    <Menubar className="border-none p-0">
      <MenubarMenu>
        <MenubarTrigger className="font-normal px-3 flex items-center">
          Style
          <ChevronDown className="h-4 w-4 ml-1" />
        </MenubarTrigger>
        <MenubarContent>
          {['Heading 1', 'Heading 2', 'Heading 3', 'Paragraph', 'Blockquote'].map((option) => (
            <MenubarItem key={option} onSelect={() => handleStyle(option as StyleOptions)}>
              {option}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
