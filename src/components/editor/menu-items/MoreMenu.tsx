import { ChevronDown, Minus } from 'lucide-react';
import { useMemo } from 'react';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Editor } from '@tiptap/react';

interface MoreOption {
  id: string;
  icon: JSX.Element;
  label: string;
  action: () => void;
}

export default function MoreMenu({ editor }: { editor: Editor }) {
  const options: MoreOption[] = useMemo(
    () => [
      {
        id: 'horizontalRule',
        icon: <Minus className="h-4 w-4" />,
        label: 'Divider',
        action: () => editor.chain().focus().setHorizontalRule().run(),
      },
    ],
    [editor],
  );

  return (
    <Menubar className="border-none p-0">
      <MenubarMenu>
        <MenubarTrigger className="px-1 flex items-center hover:bg-secondary">
          More
          <ChevronDown className="h-4 w-4" />
        </MenubarTrigger>
        <MenubarContent>
          {options.map((option) => (
            <MenubarItem key={option.id} onSelect={option.action}>
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
