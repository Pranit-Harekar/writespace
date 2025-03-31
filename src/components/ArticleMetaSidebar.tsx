
import React, { useState } from "react";
import { 
  Clock, 
  Globe, 
  CalendarCheck, 
  Tag, 
  Image as ImageIcon,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CategorySelector } from "@/components/CategorySelector";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ArticleMetaSidebarProps {
  categoryId: string | null;
  categoryName: string;
  language: string;
  readTime: number;
  featuredImage: string;
  isPublished: boolean;
  onCategoryChange: (name: string, id: string | null) => void;
  onLanguageChange: (lang: string) => void;
  onReadTimeChange: (time: number) => void;
  onFeaturedImageChange: (url: string) => void;
  onPublishChange: (isPublished: boolean) => void;
}

const ArticleMetaSidebar: React.FC<ArticleMetaSidebarProps> = ({
  categoryId,
  categoryName,
  language,
  readTime,
  featuredImage,
  isPublished,
  onCategoryChange,
  onLanguageChange,
  onReadTimeChange,
  onFeaturedImageChange,
  onPublishChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <Card>
          <CardHeader className="pb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex justify-between p-0 h-auto">
                <CardTitle className="text-base">Article Settings</CardTitle>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  <Label className="text-sm font-medium">Category</Label>
                </div>
                <CategorySelector
                  value={categoryName}
                  categoryId={categoryId}
                  onChange={onCategoryChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <Label className="text-sm font-medium">Language</Label>
                </div>
                <Select 
                  value={language} 
                  onValueChange={onLanguageChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <Label className="text-sm font-medium">Read Time (minutes)</Label>
                </div>
                <Input
                  type="number"
                  min="1"
                  value={readTime}
                  onChange={(e) => onReadTimeChange(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <Label className="text-sm font-medium">Featured Image URL</Label>
                </div>
                <Input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={featuredImage}
                  onChange={(e) => onFeaturedImageChange(e.target.value)}
                />
                {featuredImage && (
                  <div className="mt-2 rounded-md overflow-hidden border">
                    <img 
                      src={featuredImage} 
                      alt="Featured" 
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    <Label className="text-sm font-medium">Publish Article</Label>
                  </div>
                  <Switch 
                    checked={isPublished} 
                    onCheckedChange={onPublishChange} 
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isPublished ? "This article is visible to all users" : "This article is in draft mode"}
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default ArticleMetaSidebar;
