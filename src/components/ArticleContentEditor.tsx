
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RichTextToolbar from "./RichTextToolbar";

interface ArticleContentEditorProps {
  initialContent: string;
  initialTitle: string;
  initialExcerpt: string;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  onExcerptChange: (excerpt: string) => void;
}

const ArticleContentEditor: React.FC<ArticleContentEditorProps> = ({
  initialContent,
  initialTitle,
  initialExcerpt,
  onContentChange,
  onTitleChange,
  onExcerptChange,
}) => {
  const [undoStack, setUndoStack] = useState<string[]>([initialContent]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const excerptRef = useRef<HTMLParagraphElement>(null);

  // Set initial content only once on mount
  useEffect(() => {
    if (!isInitialized) {
      if (contentRef.current && initialContent) {
        contentRef.current.innerHTML = initialContent;
      }
      if (titleRef.current && initialTitle) {
        titleRef.current.textContent = initialTitle;
      }
      if (excerptRef.current && initialExcerpt) {
        excerptRef.current.textContent = initialExcerpt;
      }
      setIsInitialized(true);
    }
  }, [initialContent, initialTitle, initialExcerpt, isInitialized]);

  // Handle auto-save without resetting cursor position
  useEffect(() => {
    if (!isInitialized) return; // Skip auto-save until initialized
    
    const saveContent = () => {
      if (contentRef.current) {
        const newContent = contentRef.current.innerHTML;
        
        // Only update if content actually changed and not empty
        if (undoStack[currentPosition] !== newContent && newContent !== "") {
          // Prevent double encoding of HTML entities
          onContentChange(newContent);
          
          const newUndoStack = [...undoStack.slice(0, currentPosition + 1), newContent];
          setUndoStack(newUndoStack);
          setRedoStack([]);
          setCurrentPosition(newUndoStack.length - 1);
        }
      }
    };

    const timerId = setInterval(saveContent, 1000);
    return () => clearInterval(timerId);
  }, [onContentChange, undoStack, currentPosition, isInitialized]);

  // Handle title and excerpt changes without affecting cursor
  const handleTitleBlur = () => {
    if (titleRef.current) {
      onTitleChange(titleRef.current.textContent || "");
    }
  };
  
  const handleExcerptBlur = () => {
    if (excerptRef.current) {
      onExcerptChange(excerptRef.current.textContent || "");
    }
  };
  
  const handleContentBlur = () => {
    if (contentRef.current) {
      onContentChange(contentRef.current.innerHTML);
    }
  };

  const handleUndo = () => {
    if (currentPosition > 0) {
      const newPosition = currentPosition - 1;
      setCurrentPosition(newPosition);
      
      if (contentRef.current) {
        contentRef.current.innerHTML = undoStack[newPosition];
        const newRedoStack = [...redoStack, undoStack[currentPosition]];
        setRedoStack(newRedoStack);
      }
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const newContent = redoStack[redoStack.length - 1];
      if (contentRef.current) {
        contentRef.current.innerHTML = newContent;
        
        const newUndoStack = [...undoStack, newContent];
        setUndoStack(newUndoStack);
        setRedoStack(redoStack.slice(0, -1));
        setCurrentPosition(newUndoStack.length - 1);
      }
    }
  };

  const handleFormatText = (format: string) => {
    document.execCommand("styleWithCSS", false, "true");
    
    switch (format) {
      case "bold":
        document.execCommand("bold", false);
        break;
      case "italic":
        document.execCommand("italic", false);
        break;
      case "strikethrough":
        document.execCommand("strikeThrough", false);
        break;
      case "code":
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          const range = selection.getRangeAt(0);
          const codeElement = document.createElement("code");
          codeElement.className = "bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono text-sm";
          codeElement.textContent = selection.toString();
          range.deleteContents();
          range.insertNode(codeElement);
        }
        break;
      case "heading1":
        document.execCommand("formatBlock", false, "<h1>");
        break;
      case "heading2":
        document.execCommand("formatBlock", false, "<h2>");
        break;
      case "heading3":
        document.execCommand("formatBlock", false, "<h3>");
        break;
      case "paragraph":
        document.execCommand("formatBlock", false, "<p>");
        break;
      case "blockquote":
        document.execCommand("formatBlock", false, "<blockquote>");
        document.execCommand("indent", false);
        break;
      case "bulletList":
        document.execCommand("insertUnorderedList", false);
        break;
      case "orderedList":
        document.execCommand("insertOrderedList", false);
        break;
      default:
        break;
    }
    
    if (contentRef.current) {
      contentRef.current.focus();
    }
  };
  
  const handleInsertMedia = (type: string) => {
    switch (type) {
      case "link":
        const url = prompt("Enter URL:", "https://");
        if (url) {
          document.execCommand("createLink", false, url);
        }
        break;
      case "image":
        const imageUrl = prompt("Enter image URL:", "https://");
        if (imageUrl) {
          document.execCommand("insertImage", false, imageUrl);
        }
        break;
      case "button":
        const btnText = prompt("Button text:", "Click me");
        const btnUrl = prompt("Button URL:", "https://");
        if (btnText && btnUrl) {
          const btn = document.createElement("a");
          btn.href = btnUrl;
          btn.className = "inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 my-2";
          btn.textContent = btnText;
          btn.setAttribute("target", "_blank");
          btn.setAttribute("rel", "noopener noreferrer");
          
          const selection = window.getSelection();
          if (selection) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(btn);
          }
        }
        break;
      case "video":
        const videoUrl = prompt("Enter video URL (YouTube, Vimeo, etc.):", "https://");
        if (videoUrl) {
          const placeholder = document.createElement("div");
          placeholder.className = "border-2 border-dashed border-gray-300 p-4 text-center bg-gray-50 my-4";
          placeholder.innerHTML = `<p>Video: ${videoUrl}</p>`;
          
          const selection = window.getSelection();
          if (selection) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(placeholder);
          }
        }
        break;
      case "audio":
        const audioUrl = prompt("Enter audio URL:", "https://");
        if (audioUrl) {
          const placeholder = document.createElement("div");
          placeholder.className = "border-2 border-dashed border-gray-300 p-4 text-center bg-gray-50 my-4";
          placeholder.innerHTML = `<p>Audio: ${audioUrl}</p>`;
          
          const selection = window.getSelection();
          if (selection) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(placeholder);
          }
        }
        break;
      default:
        break;
    }
    
    if (contentRef.current) {
      contentRef.current.focus();
    }
  };
  
  const handleAlignText = (alignment: string) => {
    switch (alignment) {
      case "left":
        document.execCommand("justifyLeft", false);
        break;
      case "center":
        document.execCommand("justifyCenter", false);
        break;
      case "right":
        document.execCommand("justifyRight", false);
        break;
      case "justify":
        document.execCommand("justifyFull", false);
        break;
      default:
        break;
    }
    
    if (contentRef.current) {
      contentRef.current.focus();
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
        canUndo={currentPosition > 0}
        canRedo={redoStack.length > 0}
      />
      <div className="py-6 px-8 max-w-4xl mx-auto">
        <h1
          ref={titleRef}
          className="text-4xl font-bold mb-4 outline-none"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Title"
          onBlur={handleTitleBlur}
        >
          {!isInitialized && (initialTitle || "Title")}
        </h1>
        
        <p
          ref={excerptRef}
          className="text-lg text-gray-500 mb-8 outline-none"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Add a subtitle..."
          onBlur={handleExcerptBlur}
        >
          {!isInitialized && (initialExcerpt || "Add a subtitle...")}
        </p>
        
        <div
          ref={contentRef}
          className="prose prose-lg max-w-none outline-none min-h-[50vh]"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Start writing..."
          onBlur={handleContentBlur}
        >
          {!isInitialized && (initialContent || "<p>Start writing...</p>")}
        </div>
      </div>
    </div>
  );
};

export default ArticleContentEditor;
