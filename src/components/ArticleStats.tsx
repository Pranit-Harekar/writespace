
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
    
    // Calculate readability score with a fallback value
    let fleschScore = 0;
    
    try {
      if (plainText.length > 50) {
        fleschScore = Math.round(readability.fleeschKincaidReadingEase(plainText));
      }
    } catch (error) {
      console.error('Error calculating readability:', error);
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
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="font-medium">Readability</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="w-72 p-0 overflow-hidden">
                  <div className="bg-card border-b px-4 py-2 font-medium">
                    Reading Ease Score
                  </div>
                  <div className="p-4">
                    <p className="mb-2 text-sm">Our readability score shows how easy your text is to read:</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-green-500">Very Easy</span>
                        <span className="text-muted-foreground">90-100 (5th grade)</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-emerald-500">Easy</span>
                        <span className="text-muted-foreground">80-89 (6th grade)</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-teal-500">Fairly Easy</span>
                        <span className="text-muted-foreground">70-79 (7th grade)</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-blue-500">Standard</span>
                        <span className="text-muted-foreground">60-69 (8th-9th grade)</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-yellow-500">Fairly Difficult</span>
                        <span className="text-muted-foreground">50-59 (10th-12th grade)</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-orange-500">Difficult</span>
                        <span className="text-muted-foreground">30-49 (College)</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-red-500">Very Difficult</span>
                        <span className="text-muted-foreground">0-29 (Graduate)</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Higher scores mean easier readability.
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <span>{readabilityDescription}</span>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ArticleStats;
