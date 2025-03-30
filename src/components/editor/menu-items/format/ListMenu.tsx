import { ChevronDown, List, ListOrdered } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Editor } from '@tiptap/react';

interface ListOption {
  id: string;
  label: string;
  icon: JSX.Element;
  action: () => void;
}

export default function ListMenu({ editor }: { editor: Editor }) {
  const [selectedOption, setSelectedOption] = useState('bulletList');

  const options: ListOption[] = useMemo(
    () => [
      {
        id: 'bulletList',
        label: 'Bullet List',
        icon: <List className="h-4 w-4" />,
        action: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        id: 'orderedList',
        label: 'Ordered List',
        icon: <ListOrdered className="h-4 w-4" />,
        action: () => editor.chain().focus().toggleOrderedList().run(),
      },
    ],
    [editor]
  );

  // Update the selected option based on editor state
  useEffect(() => {
    if (!editor) return;

    // Function to determine selected option
    const updateSelectedOption = () => {
      const activeOption = options.find(option => editor.isActive(option.id));
      setSelectedOption(activeOption ? activeOption.id : 'bulletList');
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
  }, [editor, options]);

  return (
    <Menubar className="border-none p-0 hover:bg-secondary">
      <MenubarMenu>
        <MenubarTrigger className="px-2 flex items-center hover:bg-secondary">
          {options.find(option => option.id === selectedOption).icon}
          <ChevronDown className="h-4 w-4" />
        </MenubarTrigger>
        <MenubarContent>
          {options.map(option => (
            <MenubarItem
              key={option.id}
              onSelect={option.action}
              className={selectedOption === option.id ? 'bg-secondary is-active' : ''}
            >
              <span className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </span>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
