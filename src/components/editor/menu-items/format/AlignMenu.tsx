import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Editor } from '@tiptap/react';

interface AlignOption {
  id: string;
  icon: JSX.Element;
  label: string;
  action: () => void;
}

export default function AlignMenu({ editor }: { editor: Editor }) {
  const [selectedOption, setSelectedOption] = useState('left');

  const options: AlignOption[] = useMemo(
    () => [
      {
        id: 'left',
        icon: <AlignLeft className="h-4 w-4" />,
        label: 'Align Left',
        action: () => editor.chain().focus().setTextAlign('left').run(),
      },
      {
        id: 'center',
        icon: <AlignCenter className="h-4 w-4" />,
        label: 'Align Center',
        action: () => editor.chain().focus().setTextAlign('center').run(),
      },
      {
        id: 'right',
        icon: <AlignRight className="h-4 w-4" />,
        label: 'Align Right',
        action: () => editor.chain().focus().setTextAlign('right').run(),
      },
      {
        id: 'justify',
        icon: <AlignJustify className="h-4 w-4" />,
        label: 'Justify',
        action: () => editor.chain().focus().setTextAlign('justify').run(),
      },
    ],
    [editor]
  );

  // Update the selected option based on editor state
  useEffect(() => {
    if (!editor) return;

    // Function to determine selected option
    const updateSelectedOption = () => {
      const activeOption = options.find(option => {
        return editor.isActive({ textAlign: option.id });
      });
      setSelectedOption(activeOption ? activeOption.id : 'left');
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
        <MenubarTrigger className="px-2 flex items-center">
          {options.find(option => option.id === selectedOption).icon}
          <ChevronDown className="h-4 w-4" />
        </MenubarTrigger>
        <MenubarContent>
          {options.map(option => (
            <MenubarItem
              key={option.id}
              onSelect={option.action}
              className={selectedOption === option.id ? 'bg-secondary' : ''}
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
