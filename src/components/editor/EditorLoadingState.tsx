
import React from 'react';
import { Header } from '@/components/Header';

export const EditorLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-center h-full">
          <p>Loading article...</p>
        </div>
      </div>
    </div>
  );
};
