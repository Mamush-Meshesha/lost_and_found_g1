import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (
  buffer: Buffer
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "lost-and-found/items",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};