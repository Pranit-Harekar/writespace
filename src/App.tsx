
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import ArticleView from "./pages/ArticleView";
import ArticleEditor from "./pages/ArticleEditor";
import MyArticles from "./pages/MyArticles";
import SearchResults from "./pages/SearchResults";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import CategoryRedirect from "./components/CategoryRedirect";
import About from "./pages/About";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
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
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/profile/:username" element={<PublicProfile />} />
              <Route path="/article/:id" element={<ArticleView />} />
              <Route path="/article/new" element={
                <ProtectedRoute>
                  <ArticleEditor />
                </ProtectedRoute>
              } />
              <Route path="/article/edit/:id" element={
                <ProtectedRoute>
                  <ArticleEditor />
                </ProtectedRoute>
              } />
              <Route path="/my-articles" element={
                <ProtectedRoute>
                  <MyArticles />
                </ProtectedRoute>
              } />
              {/* New routes for static pages */}
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              {/* Redirect old category URLs to the new structure */}
              <Route path="/category/:category" element={<CategoryRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
