
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
import { FileUploaderSheet } from '@/components/FileUploader/FileUploaderSheet';
import { Upload } from 'lucide-react';

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

  const handleFileUploaded = (fileUrl: string, fileName?: string) => {
    setUrl(fileUrl);
    if (fileName && !text && type === 'button') {
      setText(fileName.split('.')[0]); // Use filename without extension as default text
    }
  };

  const getDialogTitle = () => {
    switch (type) {
      case 'image':
        return 'Insert Image';
      default:
        return 'Insert Media';
    }
  };

  const getUrlPlaceholder = () => {
    switch (type) {
      case 'image':
        return 'https://example.com/image.jpg';
      default:
        return 'https://example.com/media';
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
              <div className="col-span-3 flex gap-2">
                <Input
                  id="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder={getUrlPlaceholder()}
                  className="flex-1"
                  autoFocus
                />
                <FileUploaderSheet 
                  onUploadComplete={handleFileUploaded}
                  trigger={
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  }
                  title="Upload Image"
                  description="Upload an image for your article"
                  allowedFileTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                />
              </div>
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
            <Button type="submit" disabled={!url}>Insert</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDialog;
