import React, { useRef, useEffect } from 'react';

interface EditorSubtitleProps {
  initialValue: string;
  onValueChange: (value: string) => void;
}

const EditorSubtitle: React.FC<EditorSubtitleProps> = ({ initialValue, onValueChange }) => {
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (subtitleRef.current) {
      if (initialValue) {
        subtitleRef.current.textContent = initialValue;
        subtitleRef.current.dataset.empty = 'false';
      } else {
        subtitleRef.current.textContent = '';
        subtitleRef.current.dataset.empty = 'true';
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
    if (subtitleRef.current) {
      const plainText = subtitleRef.current.textContent || '';
      if (!plainText.trim()) {
        subtitleRef.current.dataset.empty = 'true';
      } else {
        subtitleRef.current.dataset.empty = 'false';
      }
    }
  };

  const handleBlur = () => {
    if (subtitleRef.current) {
      const plainText = subtitleRef.current.textContent || '';
      subtitleRef.current.textContent = plainText;
      onValueChange(plainText);

      if (!plainText.trim()) {
        subtitleRef.current.dataset.empty = 'true';
      } else {
        subtitleRef.current.dataset.empty = 'false';
      }
    }
  };

  return (
    <p
      ref={subtitleRef}
      className="text-lg text-gray-500 outline-none relative"
      contentEditable
      suppressContentEditableWarning
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onBlur={handleBlur}
      data-placeholder="Add a subtitle..."
    />
  );
};

export default EditorSubtitle;
