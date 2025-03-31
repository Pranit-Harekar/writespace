
import React, { useRef, useEffect, useState } from 'react';

interface EditorContentProps {
  initialValue: string;
  onValueChange: (value: string) => void;
}

const EditorContent: React.FC<EditorContentProps> = ({ initialValue, onValueChange }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize content only once
  useEffect(() => {
    if (!isInitialized && contentRef.current) {
      if (initialValue) {
        contentRef.current.innerHTML = initialValue;
        contentRef.current.dataset.empty = 'false';
      } else {
        contentRef.current.innerHTML = '';
        contentRef.current.dataset.empty = 'true';
      }
      setIsInitialized(true);
    }
  }, [initialValue, isInitialized]);

  const handleInput = () => {
    if (contentRef.current) {
      const hasText = contentRef.current.textContent?.trim() !== '';
      contentRef.current.dataset.empty = hasText ? 'false' : 'true';
    }
  };

  const handleBlur = () => {
    if (contentRef.current) {
      const content = contentRef.current.innerHTML;
      onValueChange(content);
      
      const hasText = contentRef.current.textContent?.trim() !== '';
      contentRef.current.dataset.empty = hasText ? 'false' : 'true';
    }
  };

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none outline-none min-h-[50vh] relative"
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      data-placeholder="Start writing..."
    />
  );
};

export default EditorContent;
