import { Redo, Undo } from 'lucide-react';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/react';

interface HistoryOption {
  id: string;
  icon: JSX.Element;
  disabled: () => boolean;
  action: () => void;
}

export default function HistoryMenu({ editor }: { editor: Editor }) {
  const className = 'h-4 w-4';
  const options: HistoryOption[] = useMemo(
    () => [
      {
        id: 'undo',
        icon: <Undo {...{ className }} />,
        disabled: () => !editor.can().undo(),
        action: () => editor.chain().focus().undo().run(),
      },
      {
        id: 'redo',
        icon: <Redo {...{ className }} />,
        disabled: () => !editor.can().redo(),
        action: () => editor.chain().focus().redo().run(),
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
          disabled={option.disabled()}
          className="h-8 w-8"
          title={option.id.charAt(0).toUpperCase()}
        >
          {option.icon}
        </Button>
      ))}
    </>
  );
}
