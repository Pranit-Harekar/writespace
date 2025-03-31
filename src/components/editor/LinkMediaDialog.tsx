
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type MediaType = 'image' | 'audio' | 'video' | 'button';

interface LinkMediaDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (url: string, text?: string) => void;
  type: MediaType;
}

const LinkMediaDialog: React.FC<LinkMediaDialogProps> = ({
  open,
  onClose,
  onConfirm,
  type,
}) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onConfirm(url, text);
      setUrl('');
      setText('');
      onClose();
    }
  };

  const getDialogTitle = () => {
    switch (type) {
      case 'image':
        return 'Insert Image';
      case 'audio':
        return 'Insert Audio';
      case 'video':
        return 'Insert Video';
      case 'button':
        return 'Insert Button';
      default:
        return 'Insert Media';
    }
  };

  const getUrlPlaceholder = () => {
    switch (type) {
      case 'image':
        return 'https://example.com/image.jpg';
      case 'audio':
        return 'https://example.com/audio.mp3';
      case 'video':
        return 'https://example.com/video.mp4';
      case 'button':
        return 'https://example.com';
      default:
        return 'https://';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={getUrlPlaceholder()}
                className="col-span-3"
                autoFocus
              />
            </div>
            {type === 'button' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="text" className="text-right">
                  Text
                </Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Click me"
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Insert</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LinkMediaDialog;
