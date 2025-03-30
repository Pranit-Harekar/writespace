
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
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden border">
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src={featuredImage && featuredImage.length > 0 ? featuredImage : placeholderImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div>
              <Badge variant="outline" className="mb-3 w-fit bg-black/40 text-white border-white/30">
                {category}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white line-clamp-2">
                {title}
              </h1>
              <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">{stripHtml(excerpt)}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={author.profileImage} alt={author.name} />
                  <AvatarFallback className="bg-primary/20 text-primary">{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-white font-medium block">
                    {author.name}
                  </span>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(publishedAt).toLocaleDateString()}
                    </span>
                    <span>{readTime} min read</span>
                  </div>
                </div>
              </div>
              <div>
                <LikeButton articleId={id} initialLikesCount={likesCount} readOnly={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
