import { CodeSquareIcon, Quote, QuoteIcon, SquareCode } from 'lucide-react';
import { useMemo } from 'react';

import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';

interface BlockOption {
  id: string;
  label: string;
  icon: JSX.Element;
  action: () => void;
}

export default function BlockMenu({ editor }: { editor: Editor }) {
  const options: BlockOption[] = useMemo(
    () => [
      {
        id: 'blockquote',
        label: 'Blockquote',
        icon: <Quote className="h-4 w-4" />,
        action: () => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        id: 'codeblock',
        label: 'Code block',
        icon: <SquareCode className="h-4 w-4" />,
        action: () => editor.chain().focus().toggleCodeBlock().run(),
      },
    ],
    [editor],
  );

  return (
    <>
      {options.map((option) => (
        <Button
          key={option.id}
          variant="ghost"
          size="icon"
          onClick={option.action}
          className={`h-8 w-8 ${editor.isActive(option.id) ? 'bg-secondary is-active' : ''}`}
          title={option.label}
        >
          {option.icon}
        </Button>
      ))}
    </>
  );
}
