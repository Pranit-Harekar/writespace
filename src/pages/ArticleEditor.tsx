import { Header } from '@/components/Header';
import ArticleContentEditor from '@/components/ArticleContentEditor';
import ArticleMetaSidebar from '@/components/ArticleMetaSidebar';
import { EditorLoadingState } from '@/components/editor/EditorLoadingState';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { useArticleEditor } from '@/hooks/useArticleEditor';

const ArticleEditor = () => {
  const {
    isLoading,
    isEditing,
    hasLoaded,
    isDeleting,
    isSaving,

    title,
    content,
    subtitle,

    categoryId,
    categoryName,
    language,
    featuredImage,
    isPublished,

    setTitle,
    setContent,
    setSubtitle,
    setLanguage,
    setFeaturedImage,
    setIsPublished,
    handleCategoryChange,
    handleSave,
    handleDelete,
  } = useArticleEditor();

  if (isLoading && isEditing && !hasLoaded) {
    return <EditorLoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <EditorToolbar
          isEditing={isEditing}
          isSaving={isSaving}
          isDeleting={isDeleting}
          isLoading={isLoading}
          onSave={handleSave}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ArticleContentEditor
              initialContent={content}
              initialTitle={title}
              initialSubtitle={subtitle}
              onContentChange={setContent}
              onTitleChange={setTitle}
              onSubtitleChange={setSubtitle}
            />
          </div>

          <div className="lg:col-span-1">
            <ArticleMetaSidebar
              categoryId={categoryId}
              categoryName={categoryName}
              language={language}
              content={content}
              featuredImage={featuredImage}
              isPublished={isPublished}
              onCategoryChange={handleCategoryChange}
              onLanguageChange={setLanguage}
              onFeaturedImageChange={setFeaturedImage}
              onPublishChange={setIsPublished}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
