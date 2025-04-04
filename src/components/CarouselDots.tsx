import React from 'react';
import { cn } from '@/lib/utils';

interface CarouselDotsProps {
  total: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}

export const CarouselDots: React.FC<CarouselDotsProps> = ({ total, activeIndex, onDotClick }) => {
  if (total <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={cn(
            'w-2 h-2 rounded-full transition-colors',
            index === activeIndex ? 'bg-primary' : 'bg-muted',
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};
