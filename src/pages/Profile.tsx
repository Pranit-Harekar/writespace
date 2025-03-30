
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES } from "@/contexts/LanguageContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";

const profileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  bio: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  preferred_language: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      bio: profile?.bio || "",
      website: profile?.website || "",
      preferred_language: profile?.preferred_language || "en",
    },
  });

  React.useEffect(() => {
    if (profile) {
      setValue("username", profile.username || "");
      setValue("full_name", profile.full_name || "");
      setValue("bio", profile.bio || "");
      setValue("website", profile.website || "");
      setValue("preferred_language", profile.preferred_language || "en");
    }
  }, [profile, setValue]);

  if (!user || !profile) {
    navigate("/login");
    return null;
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    
    const { error } = await updateProfile(data);
    
    if (error) {
      setError(error.message);
    } else {
      // Update the language in the app if the user changed it
      if (data.preferred_language !== profile?.preferred_language) {
        setLanguage(data.preferred_language as any);
      }
    }
    
    setIsLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
                <AvatarFallback>{profile.full_name ? getInitials(profile.full_name) : "U"}</AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
              <Button variant="outline" className="w-full" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>

            <div className="flex-1">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" {...register("username")} />
                  {errors.username && (
                    <p className="text-destructive text-sm">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" {...register("full_name")} />
                  {errors.full_name && (
                    <p className="text-destructive text-sm">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_language">Preferred Language</Label>
                  <Select 
                    defaultValue={profile.preferred_language} 
                    onValueChange={(value) => setValue("preferred_language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LANGUAGES).map(([code, lang]) => (
                        <SelectItem key={code} value={code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.preferred_language && (
                    <p className="text-destructive text-sm">{errors.preferred_language.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" {...register("bio")} className="h-24" />
                  {errors.bio && (
                    <p className="text-destructive text-sm">{errors.bio.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" {...register("website")} placeholder="https://" />
                  {errors.website && (
                    <p className="text-destructive text-sm">{errors.website.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
