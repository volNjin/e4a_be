import cloudinary from "../config/cloudinary.js";
import fs from "fs";

class cloudinaryService {
    static async uploadImageToCloudinary(file, folder) {
        try {
            // Upload the file to Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
                folder, // Cloudinary folder
            });

            // Delete the file from the local file system
            fs.unlinkSync(file.path);

            return {
                success: true,
                url: result.secure_url,
                public_id: result.public_id,
            };
        } catch (error) {
            console.error(error.message);
            throw new Error("Failed to upload image");
        }
    }

    static extractPublicIdFromUrl(url) {
        try {
            const parts = url.split('/');
            const publicIdWithExtension = parts[parts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            return publicId;
        } catch (error) {
            console.error(error.message);
            throw new Error("Failed to extract public_id from URL");
        }
    }

    static async deleteImageFromCloudinary(url) {
        try {
            // Extract the public_id from the URL
            const public_id = this.extractPublicIdFromUrl(url);
            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(public_id);
        } catch (error) {
            console.error(error.message);
            throw new Error("Failed to delete image");
        }
    }
}

export default cloudinaryService;