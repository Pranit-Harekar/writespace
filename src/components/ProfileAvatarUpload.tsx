
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ProfileAvatarUploadProps {
  currentAvatarUrl: string | null;
  fullName: string | null;
}

export const ProfileAvatarUpload: React.FC<ProfileAvatarUploadProps> = ({
  currentAvatarUrl,
  fullName,
}) => {
  const { uploadAvatar, removeAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, or GIF)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 2MB',
        variant: 'destructive',
      });
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload the file to Supabase
    setIsUploading(true);
    const { url, error } = await uploadAvatar(file);

    if (error) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
      // Reset preview if upload failed
      setPreviewUrl(currentAvatarUrl);
    } else {
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully',
      });
    }

    setIsUploading(false);
    
    // Clean up the object URL to avoid memory leaks
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearAvatar = async () => {
    setIsRemoving(true);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Call the removeAvatar function to delete from Supabase storage
    const { error } = await removeAvatar();
    
    if (error) {
      toast({
        title: 'Error removing avatar',
        description: error.message || 'Failed to remove profile picture',
        variant: 'destructive',
      });
    } else {
      setPreviewUrl(null);
      toast({
        title: 'Avatar removed',
        description: 'Your profile picture has been removed successfully',
      });
    }
    
    setIsRemoving(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-24 w-24 mb-2">
          <AvatarImage src={previewUrl || ''} alt={fullName || 'User avatar'} />
          <AvatarFallback>
            {fullName ? getInitials(fullName) : 'U'}
          </AvatarFallback>
        </Avatar>
        {previewUrl && (
          <button
            onClick={clearAvatar}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
            title="Remove avatar"
            disabled={isRemoving}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading || isRemoving}
      />
      <Button
        onClick={handleButtonClick}
        variant="outline"
        size="sm"
        disabled={isUploading || isRemoving}
        className="mt-2"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Upload Photo'}
      </Button>
    </div>
  );
};
