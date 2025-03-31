
import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, Unlink, ExternalLink } from 'lucide-react';

interface LinkEditorProps {
  editor: Editor;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ editor }) => {
  const [url, setUrl] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState<boolean>(false);
  const [currentLink, setCurrentLink] = useState<string>('');
  const [activeLinkPosition, setActiveLinkPosition] = useState<{ top: number; left: number } | null>(null);

  // Function to check if the current selection is on a link
  const checkForLink = useCallback(() => {
    if (!editor) return;

    if (editor.isActive('link')) {
      const linkAttrs = editor.getAttributes('link');
      setCurrentLink(linkAttrs.href || '');
      setIsEditing(true);

      // Calculate position for the floating link menu
      if (window.getSelection) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // Get editor container position
          const editorElement = editor.view.dom.closest('.ProseMirror');
          if (editorElement) {
            const editorRect = editorElement.getBoundingClientRect();
            
            setActiveLinkPosition({
              top: rect.top - editorRect.top - 40, // Position above the link
              left: rect.left - editorRect.left,
            });
          }
        }
      }
    } else {
      setIsEditing(false);
      setActiveLinkPosition(null);
      
      // Get selected text
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      setSelectedText(text);
      
      // Reset url input if not editing
      if (!isEditing) {
        setUrl('');
      }
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    // Check for link on selection change
    const handleSelectionUpdate = () => {
      checkForLink();
    };

    // Also check when the user clicks in the editor
    const handleClick = () => {
      checkForLink();
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('click', handleClick);
    
    // Initial check
    handleSelectionUpdate();
    
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('click', handleClick);
    };
  }, [editor, checkForLink]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // If there's no selection, insert a new link with the URL as text
    if (editor.state.selection.empty && !selectedText) {
      editor.chain()
        .focus()
        .insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)
        .run();
    } else {
      // With selection or in edit mode, set or update the link
      editor.chain()
        .focus()
        .setLink({ href: url, target: '_blank' })
        .run();
    }
    
    setIsLinkMenuOpen(false);
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setIsLinkMenuOpen(false);
    setIsEditing(false);
    setActiveLinkPosition(null);
  };

  const openEditMenu = () => {
    setUrl(currentLink);
    setIsLinkMenuOpen(true);
  };

  // If a link is active in the editor, show the edit/remove menu
  if (isEditing && activeLinkPosition) {
    return (
      <Popover open={isLinkMenuOpen} onOpenChange={setIsLinkMenuOpen}>
        <div 
          className="absolute z-50 bg-white rounded-md shadow-md border border-gray-200 px-3 py-2 flex items-center gap-2"
          style={{ 
            top: `${activeLinkPosition.top}px`, 
            left: `${activeLinkPosition.left}px`,
          }}
        >
          <ExternalLink className="h-4 w-4 text-orange-500" />
          <a 
            href={currentLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-orange-500 text-sm underline hover:text-orange-600"
            onClick={(e) => e.preventDefault()}
          >
            {currentLink}
          </a>
          <Button 
            variant="ghost" 
            className="h-auto p-1 text-gray-500 hover:text-gray-700"
            onClick={openEditMenu}
          >
            Change
          </Button>
          <span className="text-gray-400">|</span>
          <Button 
            variant="ghost" 
            className="h-auto p-1 text-gray-500 hover:text-gray-700"
            onClick={removeLink}
          >
            Remove
          </Button>
        </div>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4">
            <h3 className="font-medium mb-3">Edit link</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL..."
                className="w-full"
                autoFocus
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setIsLinkMenuOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Default create link button/popover
  return (
    <Popover open={isLinkMenuOpen} onOpenChange={setIsLinkMenuOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${editor.isActive('link') ? 'bg-secondary' : ''}`}
          title="Link"
          onClick={() => {
            // Get selected text before opening popover
            const { from, to } = editor.state.selection;
            const text = editor.state.doc.textBetween(from, to, ' ');
            setSelectedText(text);
          }}
        >
          <Link className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <h3 className="font-medium mb-3">Create a link</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {selectedText && (
              <Input
                value={selectedText}
                readOnly
                className="w-full bg-gray-50"
              />
            )}
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL..."
              className="w-full"
              autoFocus
            />
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setIsLinkMenuOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Link</Button>
            </div>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkEditor;
