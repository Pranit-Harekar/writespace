import { CalendarCheck, Image as ImageIcon, Tag } from 'lucide-react';
import React from 'react';

import ArticleStats from '@/components/ArticleStats';
import { CategorySelector } from '@/components/CategorySelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePlaceholderImage } from '@/hooks/use-placeholder-image';

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
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              <Label className="text-sm font-medium">Featured Image URL</Label>
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
              <Switch checked={isPublished} onCheckedChange={onPublishChange} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {isPublished
                ? 'This article is visible to all users'
                : 'This article is in draft mode'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleMetaSidebar;
