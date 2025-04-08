import { CalendarCheck, Image as ImageIcon, Tag, Upload, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import ArticleStats from '@/components/ArticleStats';
import { CategorySelector } from '@/components/CategorySelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePlaceholderImage } from '@/hooks/use-placeholder-image';
import { Alert, AlertDescription } from './ui/alert';
import { stripHtml } from '@/lib/textUtils';
import { FileUploaderSheet } from './FileUploaderSheet';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ArticleMetaSidebarProps {
  categoryId: string | null;
  categoryName: string;
  language: string;
  content: string;
  featuredImage: string;
  isPublished: boolean;
  onCategoryChange: (name: string, id: string | null) => void;
  onLanguageChange: (lang: string) => void;
  onFeaturedImageChange: (url: string) => void;
  onPublishChange: (isPublished: boolean) => void;
}

const ArticleMetaSidebar: React.FC<ArticleMetaSidebarProps> = ({
  categoryId,
  categoryName,
  content,
  featuredImage,
  isPublished,
  onCategoryChange,
  onFeaturedImageChange,
  onPublishChange,
}) => {
  const placeholderImage = usePlaceholderImage();
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);
  const { id: articleId } = useParams();

  // Calculate word count for validation
  const plainText = stripHtml(content);
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const hasEnoughWords = wordCount >= 30;

  // Check if title is a timestamp-based draft title
  const isDraftTitle = false; // We can't check this here as we don't have title prop

  // Handle publish toggle with validation
  const handlePublishChange = (newValue: boolean) => {
    // Only show validation errors if trying to publish
    if (newValue && !isPublished) {
      setShowValidationErrors(true);
    } else if (!newValue) {
      // Hide validation errors when unpublishing
      setShowValidationErrors(false);
    }

    onPublishChange(newValue);
  };

  const handleFeaturedImageUpload = (url: string) => {
    onFeaturedImageChange(url);
  };

  const handleRemoveFeaturedImage = () => {
    onFeaturedImageChange('');
  };

  return (
    <div className="space-y-4">
      <ArticleStats content={content} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Article Settings</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              <Label className="text-sm font-medium">Category</Label>
            </div>
            <CategorySelector
              value={categoryName}
              categoryId={categoryId}
              onChange={onCategoryChange}
            />
            {showValidationErrors && !categoryId && (
              <p className="text-xs text-amber-500 mt-1">Required for publishing</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              <Label className="text-sm font-medium">Featured Image</Label>
            </div>
            <div className="relative group">
              <div className="rounded-md overflow-hidden border">
                <img
                  src={featuredImage && featuredImage.length > 1 ? featuredImage : placeholderImage}
                  alt="Featured"
                  className="w-full h-32 object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src = placeholderImage;
                  }}
                />
              </div>

              {/* Hover overlay with image controls */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FileUploaderSheet
                        onUploadComplete={handleFeaturedImageUpload}
                        trigger={
                          <Button variant="secondary" size="sm" className="rounded-full p-2">
                            <Upload className="h-4 w-4" />
                          </Button>
                        }
                        articleId={articleId}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload new image</p>
                    </TooltipContent>
                  </Tooltip>

                  {featuredImage && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-full p-2"
                          onClick={handleRemoveFeaturedImage}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove image</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CalendarCheck className="h-4 w-4 mr-2" />
                <Label className="text-sm font-medium">Publish Article</Label>
              </div>
              <Switch checked={isPublished} onCheckedChange={handlePublishChange} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {isPublished
                ? 'This article is visible to all users'
                : 'This article is in draft mode'}
            </p>
          </div>

          {/* Publishing Requirements Alert - only show when validation failed */}
          {showValidationErrors && (
            <Alert className="mt-3 bg-muted">
              <AlertDescription className="text-xs">
                <strong>Publishing requirements:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li className={`${!hasEnoughWords ? 'text-amber-500' : ''}`}>
                    At least 30 words of content
                  </li>
                  <li className={`${!categoryId ? 'text-amber-500' : ''}`}>
                    Category must be selected
                  </li>
                  <li>Title cannot be a draft timestamp</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleMetaSidebar;
