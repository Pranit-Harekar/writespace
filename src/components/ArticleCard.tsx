
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { stripHtml } from '@/lib/textUtils';
import { LANGUAGES } from '@/contexts/LanguageContext';

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
  language: string;
  readTime: number;
  featuredImage?: string;
}

export const ArticleCard: React.FC<ArticleProps> = ({
  id,
  title,
  excerpt,
  author,
  publishedAt,
  category,
  language,
  readTime,
  featuredImage,
}) => {
  // Get language display name from the language code
  const languageDisplay = LANGUAGES[language as keyof typeof LANGUAGES]?.name || language;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {featuredImage && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            {category}
          </Badge>
          <Badge variant="secondary" className="mb-2">
            {languageDisplay}
          </Badge>
        </div>
        <CardTitle className="text-xl hover:text-primary transition-colors">
          <Link to={`/article/${id}`}>{title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3">{stripHtml(excerpt)}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={author.profileImage} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Link to={`/profile/${author.id}`} className="hover:text-primary">
            {author.name}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(publishedAt).toLocaleDateString()}
          </span>
          <span>{readTime} min read</span>
        </div>
      </CardFooter>
    </Card>
  );
};
