import { Calendar, Clock } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlaceholderImage } from '@/hooks/use-placeholder-image';
import { stripHtml } from '@/lib/textUtils';

import { LikeButton } from './LikeButton';

export interface ArticleProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    profileImage?: string;
  };
  publishedAt: string;
  category: string;
  readTime: number;
  featuredImage?: string;
  likesCount?: number;
  commentsCount?: number;
}

export const ArticleCard: React.FC<ArticleProps> = ({
  id,
  title,
  excerpt,
  author,
  publishedAt,
  category,
  readTime,
  featuredImage,
  likesCount = 0,
  commentsCount = 0,
}) => {
  const placeholderImage = usePlaceholderImage();
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {
        <div className="w-full h-48 overflow-hidden relative group">
          <Link to={`/article/${id}`}>
            <img
              src={featuredImage && featuredImage.length > 1 ? featuredImage : placeholderImage}
              alt={title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/90 dark:bg-black/70 px-3 py-1 rounded-full flex items-center text-sm font-medium">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {readTime} min read
              </div>
            </div>
          </Link>
        </div>
      }
      <CardHeader className="pb-2 grow-0">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            {category}
          </Badge>
        </div>
        <CardTitle className="text-xl hover:text-primary transition-colors">
          <Link to={`/article/${id}`}>{title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="grow">
        <p className="text-muted-foreground mb-3 line-clamp-2">{stripHtml(excerpt)}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t text-sm text-muted-foreground h-14">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={author.profileImage} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Link to={`/profile/${author.id}`} className="hover:text-primary">
            {author.name}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(publishedAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-3">
            <LikeButton articleId={id} initialLikesCount={likesCount} readOnly={true} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
