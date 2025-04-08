
import { CalendarCheck, Image as ImageIcon, Tag } from 'lucide-react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import ArticleStats from '@/components/ArticleStats';
import { CategorySelector } from '@/components/CategorySelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePlaceholderImage } from '@/hooks/use-placeholder-image';
import { Alert, AlertDescription } from './ui/alert';
import { stripHtml } from '@/lib/textUtils';
import { FileUploaderSheet } from './FileUploaderSheet';

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
              <p className="text-xs text-amber-500 mt-1">
                Required for publishing
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                <Label className="text-sm font-medium">Featured Image</Label>
              </div>
              <FileUploaderSheet
                onUploadComplete={handleFeaturedImageUpload}
                trigger={
                  <Button variant="outline" size="sm" className="text-xs">
                    Select Image
                  </Button>
                }
                articleId={articleId}
              />
            </div>
            <Input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={featuredImage}
              onChange={e => onFeaturedImageChange(e.target.value)}
            />
            {
              <div className="mt-2 rounded-md overflow-hidden border">
                <img
                  src={featuredImage && featuredImage.length > 1 ? featuredImage : placeholderImage}
                  alt="Featured"
                  className="w-full h-32 object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src = placeholderImage;
                  }}
                />
              </div>
            }
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
                  <li>
                    Title cannot be a draft timestamp
                  </li>
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
