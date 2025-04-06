
import React, { useMemo } from 'react';
import { FileText, Clock, Brain, TextIcon, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { stripHtml } from '@/lib/textUtils';
import readability from 'text-readability';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ArticleStatsProps {
  content: string;
}

export const ArticleStats: React.FC<ArticleStatsProps> = ({ content }) => {
  const stats = useMemo(() => {
    const plainText = stripHtml(content);
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    
    // Average reading speed is about 200-250 words per minute
    // Using 225 words per minute as a basis for calculation
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 225));
    
    // Calculate readability score only if there's enough content
    let fleschScore = 0;
    
    if (plainText.length > 50) {
      try {
        fleschScore = Math.round(readability.fleschReadingEase(plainText));
      } catch (error) {
        console.error('Error calculating readability:', error);
        // Provide fallback value if calculation fails
        fleschScore = 0;
      }
    }
    
    return {
      wordCount,
      readTimeMinutes,
      fleschScore
    };
  }, [content]);

  // Helper to determine readability level description
  const getReadabilityDescription = (score: number): string => {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  };

  const readabilityDescription = getReadabilityDescription(stats.fleschScore);

  const readabilityTooltipContent = `
    The Flesch Reading Ease Score (${stats.fleschScore}) indicates how easy your text is to read:
    
    90-100: Very Easy - 5th grade level
    80-89: Easy - 6th grade level
    70-79: Fairly Easy - 7th grade level
    60-69: Standard - 8th & 9th grade level
    50-59: Fairly Difficult - 10th-12th grade level
    30-49: Difficult - College level
    0-29: Very Difficult - College graduate level
    
    Higher scores mean the text is easier to read.
  `;

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Article Stats</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TextIcon className="h-4 w-4" />
              <span className="font-medium">Words</span>
            </div>
            <span>{stats.wordCount.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Read Time</span>
            </div>
            <span>{stats.readTimeMinutes} min</span>
          </div>
          
          {stats.fleschScore > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="font-medium">Readability</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs whitespace-pre-line">
                    {readabilityTooltipContent}
                  </TooltipContent>
                </Tooltip>
              </div>
              <span>{readabilityDescription}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ArticleStats;
