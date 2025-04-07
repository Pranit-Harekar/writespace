
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-muted py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">WriteSpace</span>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/help" className="text-muted-foreground hover:text-foreground">
              Help
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} WriteSpace - Multilingual Blog Platform for India
        </div>
      </div>
    </footer>
  );
};
