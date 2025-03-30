import {
  Bold,
  Code,
  Italic,
  RemoveFormattingIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { useMemo } from 'react';

import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';

interface MarksOption {
  id: string;
  icon: JSX.Element;
  action: () => void;
}

export default function MarksMenu({ editor }: { editor: Editor }) {
  const className = 'h-4 w-4';
  const options: MarksOption[] = useMemo(
    () => [
      {
        id: 'bold',
        icon: <Bold {...{ className }} />,
        action: () => editor.chain().focus().toggleBold().run(),
      },
      {
        id: 'italic',
        icon: <Italic {...{ className }} />,
        action: () => editor.chain().focus().toggleItalic().run(),
      },
      {
        id: 'underline',
        icon: <UnderlineIcon {...{ className }} />,
        action: () => editor.chain().focus().toggleUnderline().run(),
      },
      {
        id: 'strikethrough',
        icon: <StrikethroughIcon {...{ className }} />,
        action: () => editor.chain().focus().toggleStrike().run(),
      },
      {
        id: 'code',
        icon: <Code {...{ className }} />,
        action: () => editor.chain().focus().toggleCode().run(),
      },
      {
        id: 'clearFormatting',
        icon: <RemoveFormattingIcon {...{ className }} />,
        action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
      },
    ],
    [editor]
  );

  return (
    <>
      {options.map(option => (
        <Button
          key={option.id}
          variant="ghost"
          size="icon"
          onClick={option.action}
          className={`h-8 w-8 ${editor.isActive(option.id) ? 'bg-secondary is-active' : ''}`}
          title={option.id.charAt(0).toUpperCase() + option.id.slice(1)}
        >
          {option.icon}
        </Button>
      ))}
    </>
  );
}
