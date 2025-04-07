
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArticleProps } from './ArticleCard';
import { stripHtml } from '@/lib/textUtils';
import { LikeButton } from './LikeButton';
import { usePlaceholderImage } from '@/hooks/use-placeholder-image';

export const FeaturedArticle: React.FC<ArticleProps> = ({
  id,
  title,
  excerpt,
  author,
  publishedAt,
  category,
  readTime,
  featuredImage,
  likesCount = 0,
}) => {
  const placeholderImage = usePlaceholderImage();

  return (
    <Link to={`/article/${id}`} className="block h-full">
      <div className="relative w-full bg-card border rounded-lg overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Image container */}
          <div className="relative w-full h-48 md:h-64">
            <img
              src={featuredImage && featuredImage.length > 0 ? featuredImage : placeholderImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Content section */}
          <div className="p-4">
            <div className="mb-2">
              <Badge variant="outline" className="mb-3 w-fit">
                {category}
              </Badge>
            </div>
            
            <h1 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">
              {title}
            </h1>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {stripHtml(excerpt)}
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={author.profileImage} alt={author.name} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-sm font-medium block">
                    {author.name}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(publishedAt).toLocaleDateString()}
                    </span>
                    <span>{readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
