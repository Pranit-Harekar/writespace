
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Types
export interface ArticleImage {
  id: string;
  article_id: string;
  author_id: string;
  image_path: string | null;
  storage_url: string;
  is_uploaded: boolean;
  created_at: string;
}

// Functions for managing article images
export const articleImagesService = {
  // Track an image URL with the article (for both uploaded and external URLs)
  async trackImage(
    articleId: string,
    authorId: string,
    storageUrl: string,
    imagePath: string | null = null,
    isUploaded: boolean = true
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase.from('article_images').insert({
        article_id: articleId,
        author_id: authorId,
        storage_url: storageUrl,
        image_path: imagePath,
        is_uploaded: isUploaded,
      });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error tracking image:', error);
      return { success: false, error: error as Error };
    }
  },
  
  // Get all images associated with an article
  async getArticleImages(articleId: string): Promise<{ images: ArticleImage[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', articleId);
        
      if (error) throw error;
      
      return { images: data as ArticleImage[], error: null };
    } catch (error) {
      console.error('Error fetching article images:', error);
      return { images: null, error: error as Error };
    }
  },
  
  // Delete an image record
  async deleteImage(imageId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('article_images')
        .delete()
        .eq('id', imageId);
        
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting image record:', error);
      return { success: false, error: error as Error };
    }
  },
  
  // Upload a file to Supabase storage
  async uploadFile(
    file: File,
    bucketName: string = 'article-images',
    folderPath: string = ''
  ): Promise<{ path: string | null; url: string | null; error: Error | null }> {
    try {
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `${folderPath ? folderPath + '/' : ''}${uuidv4()}.${fileExtension}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        url: publicUrlData.publicUrl,
        error: null
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { path: null, url: null, error: error as Error };
    }
  },
  
  // Delete a file from Supabase storage
  async deleteFile(
    path: string,
    bucketName: string = 'article-images'
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);
        
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting file from storage:', error);
      return { success: false, error: error as Error };
    }
  },
  
  // Find and clean up orphaned images for an article
  async cleanupOrphanedImages(
    articleId: string,
    currentUrls: string[]
  ): Promise<{ cleanedCount: number; error: Error | null }> {
    try {
      // Get all images for this article from the database
      const { images, error } = await this.getArticleImages(articleId);
      
      if (error) throw error;
      if (!images) return { cleanedCount: 0, error: null };
      
      // Find orphaned images (those in the DB but not in currentUrls)
      const orphanedImages = images.filter(img => !currentUrls.includes(img.storage_url));
      let cleanedCount = 0;
      
      // Process each orphaned image
      for (const img of orphanedImages) {
        if (img.is_uploaded && img.image_path) {
          // Delete from storage if it was an uploaded file
          await this.deleteFile(img.image_path);
        }
        
        // Delete the record from article_images table
        await this.deleteImage(img.id);
        cleanedCount++;
      }
      
      console.log(`Cleaned up ${cleanedCount} orphaned images for article ${articleId}`);
      return { cleanedCount, error: null };
    } catch (error) {
      console.error('Error cleaning up orphaned images:', error);
      return { cleanedCount: 0, error: error as Error };
    }
  },
  
  // Extract all image URLs from HTML content
  extractImageUrls(htmlContent: string): string[] {
    const urls: string[] = [];
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      if (match[1]) {
        urls.push(match[1]);
      }
    }
    
    return urls;
  }
};
