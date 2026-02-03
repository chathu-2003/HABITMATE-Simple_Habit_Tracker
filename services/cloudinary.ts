export const CLOUDINARY_CLOUD_NAME = "dkggtagni";
export const CLOUDINARY_UPLOAD_PRESET = "habitsmate";

export const uploadImageToCloudinary = async (
  imageUri: string,
): Promise<string> => {
  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    name: `profile_${Date.now()}.jpg`,
    type: "image/jpeg",
  } as any);

  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
};

