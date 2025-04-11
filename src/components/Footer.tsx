import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ModeToggle } from '@/components/DarkModeToggle';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">{t('footer.writeSpace')}</span>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            © {currentYear} {t('footer.copyright')}
          </div>

          <div className="flex gap-6 items-center">
            <Link to="/about" className="text-muted-foreground hover:text-foreground">
              {t('footer.about')}
            </Link>
            <Link to="/help" className="text-muted-foreground hover:text-foreground">
              {t('footer.help')}
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">
              {t('footer.terms')}
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};
