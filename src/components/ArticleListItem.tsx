
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArticleProps } from './ArticleCard';
import { stripHtml } from '@/lib/textUtils';
import { LikeButton } from './LikeButton';

interface ArticleListItemProps extends ArticleProps {}

export const ArticleListItem: React.FC<ArticleListItemProps> = ({
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
  return (
    <div className="flex flex-col md:flex-row gap-4 border-b pb-6 mb-6 last:mb-0 last:border-b-0">
      <div className="md:w-1/4 lg:w-1/3">
        <Link to={`/article/${id}`} className="block overflow-hidden rounded-md">
          <img
            src={featuredImage && featuredImage.length > 1 ? featuredImage : '/placeholder.svg'}
            alt={title}
            className="w-full h-48 md:h-28 object-cover hover:scale-105 transition-transform"
          />
        </Link>
      </div>
      
      <div className="md:w-3/4 lg:w-2/3 flex flex-col">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span className="font-medium text-foreground">{category}</span>
          <span className="text-xs">•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime} min read
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
          <Link to={`/article/${id}`}>{title}</Link>
        </h3>
        
        <p className="text-muted-foreground mb-3 line-clamp-2">{stripHtml(excerpt)}</p>
        
        <div className="flex items-center justify-between mt-auto text-sm">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.profileImage} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Link to={`/profile/${author.id}`} className="hover:text-primary">
              {author.name}
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(publishedAt).toLocaleDateString()}
            </span>
          </div>
          
          <LikeButton articleId={id} initialLikesCount={likesCount} readOnly={true} />
        </div>
      </div>
    </div>
  );
};
