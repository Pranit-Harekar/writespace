
import React, { useMemo } from 'react';
import { FileText, Clock, Brain, TextIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { stripHtml } from '@/lib/textUtils';
import * as readability from 'text-readability';

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
    
    // Calculate readability scores only if there's enough content
    let fleschScore = 0;
    let gradeLevel = '';
    
    if (plainText.length > 50) {
      fleschScore = Math.round(readability.fleschReadingEase(plainText));
      // Convert Flesch-Kincaid Grade Level to a readable format
      const gradeScore = readability.fleschKincaidGrade(plainText);
      gradeLevel = gradeScore <= 12 
        ? `Grade ${Math.round(gradeScore)}`
        : `College ${Math.round(gradeScore - 12)}`;
    }
    
    return {
      wordCount,
      readTimeMinutes,
      fleschScore,
      gradeLevel
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
          <>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="font-medium">Readability</span>
              </div>
              <span title={`Flesch Reading Ease: ${stats.fleschScore}`}>{readabilityDescription}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Grade Level</span>
              </div>
              <span>{stats.gradeLevel}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleStats;
