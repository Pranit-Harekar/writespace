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

interface MediaDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (url: string, text?: string) => void;
  type: MediaType;
}

const MediaDialog: React.FC<MediaDialogProps> = ({ open, onClose, onConfirm, type }) => {
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
    }
  };

  const getUrlPlaceholder = () => {
    switch (type) {
      case 'image':
        return 'https://example.com/image.jpg';
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
                onChange={e => setUrl(e.target.value)}
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
                  onChange={e => setText(e.target.value)}
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

export default MediaDialog;
