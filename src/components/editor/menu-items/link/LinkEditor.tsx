
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LinkEditorProps {
  editor: Editor;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ editor }) => {
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState<boolean>(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [url, setUrl] = useState<string>('');
  const [openInNewTab, setOpenInNewTab] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Track if text is selected or if we're on an existing link
  const isLinkActive = editor?.isActive('link');
  const hasTextSelection = editor?.state.selection.content().size > 0;
  const isLinkEditorEnabled = isLinkActive || hasTextSelection;
  
  const calculatePopoverPosition = useCallback(() => {
    if (!editor) return;

    const { view } = editor;
    const { state } = view;
    const { from, to } = state.selection;

    if (from === to && !isLinkActive) return;

    // Get the coordinates of the cursor position
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    
    // Calculate the viewport-relative position
    const viewportTop = window.scrollY;
    const viewportLeft = window.scrollX;
    
    // Use the center point for the popover position
    const x = isLinkActive ? start.left : (start.left + end.left) / 2;
    const y = Math.max(start.bottom, end.bottom) + 5; // Add a small offset
    
    // Set position state
    setPopoverPosition({ 
      x: x + viewportLeft, 
      y: y + viewportTop 
    });
  }, [editor, isLinkActive]);

  const getLinkAttributes = useCallback(() => {
    if (!editor || !isLinkActive) return { href: '', target: '' };
    
    const attrs = editor.getAttributes('link');
    return {
      href: attrs.href || '',
      target: attrs.target || ''
    };
  }, [editor, isLinkActive]);

  const handleOpenPopover = useCallback(() => {
    if (!isLinkEditorEnabled) return;
    
    calculatePopoverPosition();
    
    const attrs = getLinkAttributes();
    setUrl(attrs.href);
    setOpenInNewTab(attrs.target === '_blank');
    setIsEditMode(!isLinkActive); // Go directly to edit mode for new links
    setIsLinkMenuOpen(true);
    
    // Focus the URL input after a short delay if in edit mode
    if (!isLinkActive) {
      setTimeout(() => {
        if (urlInputRef.current) {
          urlInputRef.current.focus();
          urlInputRef.current.select();
        }
      }, 10);
    }
  }, [isLinkEditorEnabled, calculatePopoverPosition, getLinkAttributes, isLinkActive]);

  const handleSetLink = () => {
    if (!editor) return;
    
    if (url === '') {
      // If URL is empty, unset the link
      if (isLinkActive) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      }
      setIsLinkMenuOpen(false);
      return;
    }
    
    // Format URL if it doesn't have a protocol
    const formattedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    
    const linkAttrs = {
      href: formattedUrl,
      target: openInNewTab ? '_blank' : null,
    };
    
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink(linkAttrs)
      .run();
    
    setIsLinkMenuOpen(false);
    setIsEditMode(false);
  };
  
  const handleDelete = () => {
    if (editor && isLinkActive) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setIsLinkMenuOpen(false);
      setIsEditMode(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    
    // Focus the URL input after a short delay
    setTimeout(() => {
      if (urlInputRef.current) {
        urlInputRef.current.focus();
        urlInputRef.current.select();
      }
    }, 10);
  };
  
  // Add keyboard event handler for Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSetLink();
      e.preventDefault();
    }
  };

  // Update position when scrolling or on window resize
  useEffect(() => {
    if (!isLinkMenuOpen) return;

    const handleUpdate = () => {
      calculatePopoverPosition();
    };

    window.addEventListener('scroll', handleUpdate, { passive: true });
    window.addEventListener('resize', handleUpdate, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isLinkMenuOpen, calculatePopoverPosition]);
  
  // Watch for selection changes to enable/disable the link button
  useEffect(() => {
    if (!editor) return;
    
    const handleSelectionUpdate = () => {
      // If popover is open and we click elsewhere, close it
      if (isLinkMenuOpen && !editor.isActive('link') && editor.state.selection.empty) {
        setIsLinkMenuOpen(false);
        setIsEditMode(false);
      }
    };
    
    editor.on('selectionUpdate', handleSelectionUpdate);
    
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, isLinkMenuOpen]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8',
          isLinkActive ? 'bg-secondary is-active' : '',
          !isLinkEditorEnabled ? 'opacity-50 cursor-not-allowed' : ''
        )}
        title="Link"
        onClick={handleOpenPopover}
        disabled={!isLinkEditorEnabled}
      >
        <Link className="h-4 w-4" />
      </Button>
      
      <Popover open={isLinkMenuOpen} onOpenChange={setIsLinkMenuOpen}>
        <PopoverTrigger asChild>
          <div 
            ref={triggerRef} 
            style={{
              position: 'fixed',
              left: '0px',
              top: '0px',
              width: '0px',
              height: '0px',
              pointerEvents: 'none',
              opacity: 0
            }} 
          />
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 shadow-md" 
          align="start" 
          sideOffset={5}
          containerStyle={{
            position: 'fixed',
            top: `${popoverPosition.y}px`,
            left: `${popoverPosition.x}px`,
            transform: 'translateX(-50%)',
            margin: 0,
            width: 'auto',
          }}
        >
          {isLinkActive && !isEditMode ? (
            // Intermediate state UI - show a preview of the link with edit/delete options
            <div className="flex items-center p-3 space-x-2 min-w-[200px]">
              <div className="flex-1 truncate text-sm">
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block">
                  {url}
                </a>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                title="Edit link"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-destructive hover:text-destructive/90 hover:bg-destructive/10" 
                title="Remove link"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // Edit mode UI
            <div className="flex flex-col p-3 space-y-2 min-w-[300px]">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Link className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={urlInputRef}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="pl-8"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button 
                  onClick={handleSetLink}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Set Link
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">Open in new tab</div>
                <Switch
                  checked={openInNewTab}
                  onCheckedChange={setOpenInNewTab}
                />
              </div>
              
              {isLinkActive && (
                <div className="flex justify-end pt-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDelete}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default LinkEditor;
