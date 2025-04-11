import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CategoryRedirect from './components/CategoryRedirect';
import { ConditionalFooter } from './components/ConditionalFooter';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './components/ThemeProvider';
import About from './pages/About';
import ArticleEditor from './pages/ArticleEditor';
import ArticleView from './pages/ArticleView';
import CategoryView from './pages/CategoryView';
import ForgotPassword from './pages/ForgotPassword';
import Help from './pages/Help';
import Index from './pages/Index';
import Login from './pages/Login';
import MyArticles from './pages/MyArticles';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import SearchResults from './pages/SearchResults';
import Terms from './pages/Terms';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/search/category/:category" element={<SearchResults />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile/:username" element={<PublicProfile />} />
                <Route path="/article/:id" element={<ArticleView />} />
                <Route
                  path="/article/new"
                  element={
                    <ProtectedRoute>
                      <MyArticles />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/article/edit/:id"
                  element={
                    <ProtectedRoute>
                      <ArticleEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-articles"
                  element={
                    <ProtectedRoute>
                      <MyArticles />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/category/:category" element={<CategoryView />} />
                <Route path="/category/redirect/:category" element={<CategoryRedirect />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ConditionalFooter />
            </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
