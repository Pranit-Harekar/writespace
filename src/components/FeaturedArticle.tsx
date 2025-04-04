import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArticleProps } from './ArticleCard';
import { stripHtml } from '@/lib/textUtils';
import { LikeButton } from './LikeButton';

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
  return (
    <div className="grid md:grid-cols-5 gap-4 rounded-lg overflow-hidden border p-0 md:p-0 h-[240px]">
      <div className="md:col-span-3 order-2 md:order-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex gap-2 mb-2">
            <Badge variant="outline">{category}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2 hover:text-primary transition-colors">
            <Link to={`/article/${id}`}>{title}</Link>
          </h1>
          <p className="text-muted-foreground mb-4 line-clamp-2">{stripHtml(excerpt)}</p>
        </div>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <Avatar>
              <AvatarImage src={author.profileImage} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <Link to={`/profile/${author.id}`} className="font-medium hover:text-primary">
                {author.name}
              </Link>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(publishedAt).toLocaleDateString()}
                </span>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <LikeButton articleId={id} initialLikesCount={likesCount} readOnly={true} />
            <Button asChild className="carousel-pause-trigger">
              <Link to={`/article/${id}`}>Read Full Article</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="md:col-span-2 order-1 md:order-2 h-[180px] md:h-auto relative">
        <div className="absolute inset-0">
          <img
            src={featuredImage && featuredImage.length > 0 ? featuredImage : '/placeholder.svg'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
