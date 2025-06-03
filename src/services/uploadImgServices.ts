import {
    UploadApiErrorResponse,
    UploadApiOptions,
    UploadApiResponse,
} from "cloudinary";
import { cloudinary } from "../lib/cloudinary";

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
export interface CloudinaryUploadOptions extends UploadApiOptions {
    buffer?: Buffer;
    base64?: string;
    public_id?: string;
}

export async function uploadImgServices({
    buffer,
    folder,
    public_id,
}: CloudinaryUploadOptions): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
                    resource_type: "image",
                    public_id,
                    overwrite: !!public_id,
                    invalidate: !!public_id,
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(error);
                    }
                    resolve(result);
                }
            )
            .end(buffer);
    });
}