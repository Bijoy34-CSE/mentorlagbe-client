const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Uploads an image file to ImgBB and returns the public image link
export async function uploadImage(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("ImgBB API key is missing");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > MAX_SIZE) throw new Error("Image must be smaller than 5 MB");

  const form = new FormData();
  form.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: form,
  });
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error("Image upload failed. Please try again.");
  }
  return result.data.display_url as string;
}