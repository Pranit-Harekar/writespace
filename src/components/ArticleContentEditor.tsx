
import React, { useRef, useEffect } from 'react'
import { useEditorHistory } from './editor/useEditorHistory'
import EditorTitle from './editor/EditorTitle'
import EditorExcerpt from './editor/EditorExcerpt'
import EditorContent from './editor/EditorContent'
import RichTextToolbar from './RichTextToolbar'

interface ArticleContentEditorProps {
  initialContent: string
  initialTitle: string
  initialExcerpt: string
  onContentChange: (content: string) => void
  onTitleChange: (title: string) => void
  onExcerptChange: (excerpt: string) => void
}

const ArticleContentEditor: React.FC<ArticleContentEditorProps> = ({
  initialContent,
  initialTitle,
  initialExcerpt,
  onContentChange,
  onTitleChange,
  onExcerptChange,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const editorHistory = useEditorHistory(initialContent);
  
  // Auto-save content to history periodically
  useEffect(() => {
    if (!contentRef.current) return;
    
    const saveContent = () => {
      if (contentRef.current) {
        const content = contentRef.current.innerHTML;
        editorHistory.saveToHistory(content);
      }
    };
    
    const timerId = setInterval(saveContent, 3000);
    return () => clearInterval(timerId);
  }, []);

  const handleUndo = () => {
    const previousContent = editorHistory.undo();
    if (previousContent !== null && contentRef.current) {
      contentRef.current.innerHTML = previousContent;
    }
  };

  const handleRedo = () => {
    const nextContent = editorHistory.redo();
    if (nextContent !== null && contentRef.current) {
      contentRef.current.innerHTML = nextContent;
    }
  };

  const handleFormatText = (format: string) => {
    // Focus content area first
    if (contentRef.current) {
      contentRef.current.focus();
    }

    document.execCommand('styleWithCSS', false, 'true');

    switch (format) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough', false);
        break;
      case 'code': {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          const range = selection.getRangeAt(0);
          const codeElement = document.createElement('code');
          codeElement.className = 'bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono text-sm';
          codeElement.textContent = selection.toString();
          range.deleteContents();
          range.insertNode(codeElement);
        }
        break;
      }
      case 'clearFormatting':
        document.execCommand('removeFormat', false);
        break;
      case 'heading1':
        document.execCommand('formatBlock', false, '<h1>');
        break;
      case 'heading2':
        document.execCommand('formatBlock', false, '<h2>');
        break;
      case 'heading3':
        document.execCommand('formatBlock', false, '<h3>');
        break;
      case 'paragraph':
        document.execCommand('formatBlock', false, '<p>');
        break;
      case 'blockquote':
        document.execCommand('formatBlock', false, '<blockquote>');
        document.execCommand('indent', false);
        break;
      case 'bulletList':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'orderedList':
        document.execCommand('insertOrderedList', false);
        break;
      default:
        break;
    }
  };

  const handleInsertMedia = (type: string) => {
    // Focus content area first
    if (contentRef.current) {
      contentRef.current.focus();
    }

    switch (type) {
      case 'link': {
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
      }
      case 'image': {
        const imageUrl = prompt('Enter image URL:', 'https://');
        if (imageUrl) {
          document.execCommand('insertImage', false, imageUrl);
        }
        break;
      }
      case 'button': {
        const btnText = prompt('Button text:', 'Click me');
        const btnUrl = prompt('Button URL:', 'https://');
        if (btnText && btnUrl) {
          const btn = document.createElement('a');
          btn.href = btnUrl;
          btn.className =
            'inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 my-2';
          btn.textContent = btnText;
          btn.setAttribute('target', '_blank');
          btn.setAttribute('rel', 'noopener noreferrer');

          const selection = window.getSelection();
          if (selection) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(btn);
          }
        }
        break;
      }
      case 'video': {
        const videoUrl = prompt('Enter video URL (YouTube, Vimeo, etc.):', 'https://');
        if (videoUrl) {
          const placeholder = document.createElement('div');
          placeholder.className =
            'border-2 border-dashed border-gray-300 p-4 text-center bg-gray-50 my-4';
          placeholder.innerHTML = `<p>Video: ${videoUrl}</p>`;

          const selection = window.getSelection();
          if (selection) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(placeholder);
          }
        }
        break;
      }
      case 'audio': {
        const audioUrl = prompt('Enter audio URL:', 'https://');
        if (audioUrl) {
          const placeholder = document.createElement('div');
          placeholder.className =
            'border-2 border-dashed border-gray-300 p-4 text-center bg-gray-50 my-4';
          placeholder.innerHTML = `<p>Audio: ${audioUrl}</p>`;

          const selection = window.getSelection();
          if (selection) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(placeholder);
          }
        }
        break;
      }
      default:
        break;
    }
  };

  const handleAlignText = (alignment: string) => {
    // Focus content area first
    if (contentRef.current) {
      contentRef.current.focus();
    }

    switch (alignment) {
      case 'left':
        document.execCommand('justifyLeft', false);
        break;
      case 'center':
        document.execCommand('justifyCenter', false);
        break;
      case 'right':
        document.execCommand('justifyRight', false);
        break;
      case 'justify':
        document.execCommand('justifyFull', false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white">
      <RichTextToolbar
        onFormatText={handleFormatText}
        onInsertMedia={handleInsertMedia}
        onAlignText={handleAlignText}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={editorHistory.canUndo}
        canRedo={editorHistory.canRedo}
      />
      <div className="py-6 px-8 max-w-4xl mx-auto" ref={contentRef}>
        <EditorTitle 
          initialValue={initialTitle} 
          onValueChange={onTitleChange} 
        />
        
        <EditorExcerpt 
          initialValue={initialExcerpt} 
          onValueChange={onExcerptChange} 
        />
        
        <EditorContent 
          initialValue={initialContent} 
          onValueChange={onContentChange} 
        />
      </div>
    </div>
  );
};

export default ArticleContentEditor;

// Add CSS for placeholders
const style = document.createElement('style');
style.innerHTML = `
  [contenteditable][data-placeholder][data-empty="true"]:before {
    content: attr(data-placeholder);
    color: #9ca3af;
    cursor: text;
    position: absolute;
    left: 0;
    pointer-events: none;
  }
`;
document.head.appendChild(style);
