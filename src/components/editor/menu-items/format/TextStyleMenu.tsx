import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Editor } from '@tiptap/react';

interface StyleOption {
  id: string;
  label: string;
  action: () => void;
}

export default function TextStyleMenu({ editor }: { editor: Editor }) {
  const [selectedOption, setSelectedOption] = useState('paragraph');

  const options: StyleOption[] = useMemo(
    () => [
      {
        id: 'heading1',
        label: 'Heading 1',
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        id: 'heading2',
        label: 'Heading 2',
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        id: 'heading3',
        label: 'Heading 3',
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        id: 'heading4',
        label: 'Heading 4',
        action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      },
      {
        id: 'heading5',
        label: 'Heading 5',
        action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      },
      {
        id: 'heading6',
        label: 'Heading 6',
        action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      },
      {
        id: 'paragraph',
        label: 'Normal',
        action: () => editor.chain().focus().setParagraph().run(),
      },
    ],
    [editor]
  );

  // Update the selected option based on editor state
  useEffect(() => {
    if (!editor) return;

    // Function to determine selected option
    const updateSelectedOption = () => {
      if (editor.isActive('heading', { level: 1 })) {
        setSelectedOption('heading1');
      } else if (editor.isActive('heading', { level: 2 })) {
        setSelectedOption('heading2');
      } else if (editor.isActive('heading', { level: 3 })) {
        setSelectedOption('heading3');
      } else if (editor.isActive('heading', { level: 4 })) {
        setSelectedOption('heading4');
      } else if (editor.isActive('heading', { level: 5 })) {
        setSelectedOption('heading5');
      } else if (editor.isActive('heading', { level: 6 })) {
        setSelectedOption('heading6');
      } else {
        setSelectedOption('paragraph');
      }
    };

    // Initial update
    updateSelectedOption();

    // Subscribe to selection changes
    editor.on('selectionUpdate', updateSelectedOption);
    editor.on('transaction', updateSelectedOption);

    return () => {
      // Cleanup event listeners
      editor.off('selectionUpdate', updateSelectedOption);
      editor.off('transaction', updateSelectedOption);
    };
  }, [editor]);

  return (
    <Menubar className="border-none p-0 hover:bg-secondary">
      <MenubarMenu>
        <MenubarTrigger className="font-normal px-2 flex items-center">
          {options.find(option => option.id === selectedOption)?.label || 'Normal'}
          <ChevronDown className="h-4 w-4 ml-1" />
        </MenubarTrigger>
        <MenubarContent>
          {options.map(option => (
            <MenubarItem
              key={option.id}
              onSelect={option.action}
              className={selectedOption === option.id ? 'bg-secondary is-active' : ''}
            >
              <span className="flex items-center gap-2">{option.label}</span>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
