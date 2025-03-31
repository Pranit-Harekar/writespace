import React, { useRef, useEffect } from 'react';

interface EditorExcerptProps {
  initialValue: string;
  onValueChange: (value: string) => void;
}

const EditorExcerpt: React.FC<EditorExcerptProps> = ({ initialValue, onValueChange }) => {
  const excerptRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (excerptRef.current) {
      if (initialValue) {
        excerptRef.current.textContent = initialValue;
        excerptRef.current.dataset.empty = 'false';
      } else {
        excerptRef.current.dataset.empty = 'true';
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

  const handleBlur = () => {
    if (excerptRef.current) {
      const plainText = excerptRef.current.textContent || '';
      excerptRef.current.textContent = plainText;
      onValueChange(plainText);

      if (!plainText.trim()) {
        excerptRef.current.dataset.empty = 'true';
      } else {
        excerptRef.current.dataset.empty = 'false';
      }
    }
  };

  return (
    <p
      ref={excerptRef}
      className="text-lg text-gray-500 mb-8 outline-none relative"
      contentEditable
      suppressContentEditableWarning
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      data-placeholder="Add a subtitle..."
    />
  );
};

export default EditorExcerpt;
