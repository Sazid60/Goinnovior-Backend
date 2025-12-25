/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import config from '.';


cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
})


export const deleteImageFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)(\.[^/.]+)?$/;
        const match = url.match(regex);

        console.log({ match })
        if (match && match[1]) {
            const public_id = match[1];
            let resourceType: "image" | "video" = "image";
            if (url.includes("/video/") || public_id.match(/\.(mp4|mov|avi|mkv|webm)$/i)) {
                resourceType = "video";
            }
            await cloudinary.uploader.destroy(public_id, { resource_type: resourceType });
            console.log(`File ${public_id} is deleted from cloudinary`);
        }
    } catch (error: any) {
        throw new Error(`Cloudinary image deletion failed ${error.message}`)
    }
}



export const cloudinaryUpload = cloudinary