import cloudinary from "./cloudinary";

export const uploader = async (path: string, publicId: string) => {
  const result = await cloudinary.v2.uploader.upload(path, {
    resource_type: "auto",
    folder: "tiktok-clone",
    public_id: publicId,
  });

  return result;
};
