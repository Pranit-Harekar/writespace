
import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, Link, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FileUploaderSheetProps {
  onUploadComplete: (url: string, filename?: string) => void;
  trigger?: React.ReactNode;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in MB
  title?: string;
  description?: string;
  bucketName?: string;
  folderPath?: string;
  articleId?: string | null; // Add article ID
}

export function FileUploaderSheet({
  onUploadComplete,
  trigger,
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFileSize = 5, // Default to 5MB
  title = 'Upload File',
  description = 'Upload a file from your device or paste a URL.',
  bucketName = 'article-images',
  folderPath = '',
  articleId = null, // Default to null
}: FileUploaderSheetProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);

  const maxFileSizeBytes = maxFileSize * 1024 * 1024;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to upload files',
          variant: 'destructive',
        });
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > maxFileSizeBytes) {
        toast({
          title: 'File too large',
          description: `The file exceeds the maximum size of ${maxFileSize}MB`,
          variant: 'destructive',
        });
        return;
      }

      setIsUploading(true);

      try {
        // Generate a unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${folderPath ? folderPath + '/' : ''}${uuidv4()}.${fileExtension}`;

        const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error) throw error;

        const { data: publicUrl } = supabase.storage.from(bucketName).getPublicUrl(data.path);
        
        // If articleId is provided, associate this image with the article
        if (articleId && user) {
          const { error: associationError } = await supabase
            .from('article_images')
            .insert({
              article_id: articleId,
              author_id: user.id,
              image_path: data.path,
              storage_url: publicUrl.publicUrl,
              is_uploaded: true
            });
          
          if (associationError) {
            console.error('Error associating image with article:', associationError);
          }
        }

        onUploadComplete(publicUrl.publicUrl, file.name);
        setIsOpen(false);

        toast({
          title: 'Upload successful',
          description: 'Your file has been uploaded successfully',
        });
      } catch (error: any) {
        console.error('Upload error:', error);
        toast({
          title: 'Upload failed',
          description: error.message || 'There was an error uploading your file',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [user, bucketName, folderPath, maxFileSizeBytes, maxFileSize, toast, onUploadComplete, articleId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSizeBytes,
    multiple: false,
  });

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    try {
      const url = new URL(urlInput);
      
      // If articleId is provided, track this external URL
      if (articleId && user) {
        supabase
          .from('article_images')
          .insert({
            article_id: articleId,
            author_id: user.id,
            storage_url: urlInput,
            is_uploaded: false // This is an external URL, not uploaded to storage
          }).then(({ error }) => {
            if (error) {
              console.error('Error tracking external image URL:', error);
            }
          });
      }
      
      onUploadComplete(urlInput);
      setUrlInput('');
      setIsOpen(false);

      toast({
        title: 'URL added',
        description: 'The URL has been added successfully',
      });
    } catch (error) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild ref={sheetTriggerRef}>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" /> Upload
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" /> Upload File
              </TabsTrigger>
              <TabsTrigger value="url">
                <Link className="h-4 w-4 mr-2" /> Use URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="pt-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors ${
                  isDragActive ? 'border-primary bg-muted/50' : 'border-muted-foreground/25'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <Image className="h-8 w-8 text-muted-foreground" />
                  {isDragActive ? (
                    <p>Drop the file here...</p>
                  ) : (
                    <>
                      <p className="font-medium">Drag and drop your file here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Maximum file size: {maxFileSize}MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="pt-4">
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!urlInput}>
                      Add
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isUploading}>{isUploading ? 'Uploading...' : 'Done'}</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
