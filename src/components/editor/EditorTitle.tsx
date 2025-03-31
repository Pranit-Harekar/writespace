import React, { useRef, useEffect } from 'react';

interface EditorTitleProps {
  initialValue: string;
  onValueChange: (value: string) => void;
}

const EditorTitle: React.FC<EditorTitleProps> = ({ initialValue, onValueChange }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      if (initialValue) {
        titleRef.current.textContent = initialValue;
        titleRef.current.dataset.empty = 'false';
      } else {
        titleRef.current.textContent = '';
        titleRef.current.dataset.empty = 'true';
      }
    }
  }, [initialValue]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent formatting keyboard shortcuts
    if ((e.ctrlKey || e.metaKey) && ['b', 'i', 'u'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  };

  const handleInput = () => {
    if (titleRef.current) {
      const plainText = titleRef.current.textContent || '';
      if (!plainText.trim()) {
        titleRef.current.dataset.empty = 'true';
      } else {
        titleRef.current.dataset.empty = 'false';
      }
    }
  };

  const handleBlur = () => {
    if (titleRef.current) {
      const plainText = titleRef.current.textContent || '';
      titleRef.current.textContent = plainText;
      onValueChange(plainText);

      if (!plainText.trim()) {
        titleRef.current.dataset.empty = 'true';
      } else {
        titleRef.current.dataset.empty = 'false';
      }
    }
  };

  return (
    <h1
      ref={titleRef}
      className="text-4xl font-bold outline-none relative"
      contentEditable
      suppressContentEditableWarning
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onBlur={handleBlur}
      data-placeholder="Title"
    />
  );
};

export default EditorTitle;
