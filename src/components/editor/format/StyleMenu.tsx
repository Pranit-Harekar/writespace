import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

type StyleOptions = 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Paragraph' | 'Blockquote';

export default function StyleMenu({ editor }) {
  const [activeStyle, setActiveStyle] = useState<StyleOptions>('Paragraph');

  // Update the active style based on editor state
  useEffect(() => {
    if (!editor) return;

    // Function to determine current active style
    const updateActiveStyle = () => {
      if (editor.isActive('heading', { level: 1 })) {
        setActiveStyle('Heading 1');
      } else if (editor.isActive('heading', { level: 2 })) {
        setActiveStyle('Heading 2');
      } else if (editor.isActive('heading', { level: 3 })) {
        setActiveStyle('Heading 3');
      } else if (editor.isActive('blockquote')) {
        setActiveStyle('Blockquote');
      } else {
        setActiveStyle('Paragraph');
      }
    };

    // Initial update
    updateActiveStyle();

    // Subscribe to selection changes
    editor.on('selectionUpdate', updateActiveStyle);
    editor.on('transaction', updateActiveStyle);

    return () => {
      // Cleanup event listeners
      editor.off('selectionUpdate', updateActiveStyle);
      editor.off('transaction', updateActiveStyle);
    };
  }, [editor]);

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
          {activeStyle}
          <ChevronDown className="h-4 w-4 ml-1" />
        </MenubarTrigger>
        <MenubarContent>
          {(
            ['Heading 1', 'Heading 2', 'Heading 3', 'Paragraph', 'Blockquote'] as StyleOptions[]
          ).map((option) => (
            <MenubarItem
              key={option}
              onSelect={() => handleStyle(option)}
              className={activeStyle === option ? 'bg-secondary' : ''}
            >
              {option}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
