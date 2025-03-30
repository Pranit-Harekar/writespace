import React, { useMemo } from 'react';
import { TextIcon, Clock, AlignJustify, WholeWordIcon, WrapTextIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { stripHtml } from '@/lib/textUtils';

interface ArticleStatsProps {
  content: string;
}

export const ArticleStats: React.FC<ArticleStatsProps> = ({ content }) => {
  const stats = useMemo(() => {
    const plainText = stripHtml(content);
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;

    // Count sentences (basic implementation: split by ., !, ?)
    const sentenceCount = plainText
      .split(/[.!?]+/)
      .filter(sentence => sentence.trim().length > 0).length;

    // Average reading speed is about 200-250 words per minute
    // Using 225 words per minute as a basis for calculation
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 225));

    return {
      wordCount,
      sentenceCount,
      readTimeMinutes,
    };
  }, [content]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Article Stats</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <WholeWordIcon className="h-4 w-4" />
            <span className="font-medium">Words</span>
          </div>
          <span>{stats.wordCount.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <WrapTextIcon className="h-4 w-4" />
            <span className="font-medium">Sentences</span>
          </div>
          <span>{stats.sentenceCount.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Read Time</span>
          </div>
          <span>{stats.readTimeMinutes} min</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleStats;
