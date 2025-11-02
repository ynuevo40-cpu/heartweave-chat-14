import { supabase } from "@/integrations/supabase/client";

export const uploadAvatar = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    return { url: null, error };
  }
};

export const uploadCoverImage = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `cover-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error: any) {
    console.error("Error uploading cover:", error);
    return { url: null, error };
  }
};

export const uploadPostMedia = async (file: File) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("post-media")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("post-media")
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error: any) {
    console.error("Error uploading media:", error);
    return { url: null, error };
  }
};

export const deleteMedia = async (url: string) => {
  try {
    const path = url.split("/").pop();
    if (!path) return;

    // Try both buckets
    await supabase.storage.from("post-media").remove([path]);
    await supabase.storage.from("avatars").remove([path]);
  } catch (error) {
    console.error("Error deleting media:", error);
  }
};
