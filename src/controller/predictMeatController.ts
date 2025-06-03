import { uploadImgServices as storeImagetoCloudinary } from "../services/uploadImgServices";
import { predictImage as predictMeatService } from "../services/predictMeatServices";
import sharp from 'sharp';
import { preprocessImage } from "../utils/preprocesssImage";
import { Request, Response } from "express";


export const predictMeatController = async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).send('No image uploaded.');
        return;
    }
    try {
        const fileBUffer = req.file.buffer
        const folder = "meat-predictions"

        //prediksi gambar daging disini
        const inputTensor = preprocessImage(fileBUffer);
        const { prediction: { ...result } } = await predictMeatService(inputTensor);

        // optimasi gambar
        await sharp(fileBUffer)
            .resize(1000, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .jpeg({ quality: 80, progressive: true })
            .toBuffer();

        // janlup simpan gambar yang telah dioptimasi ke media cloudinary ya wok
        const { secure_url } = await storeImagetoCloudinary({
            buffer: fileBUffer,
            folder,
            public_id: `${folder}-${Date.now()}`
        })

        res.json({
            status_code: 200,
            message: `Success to predict!, your meat is ${result.label}!`,
            result: {
                ...result,
                url: secure_url,
            },
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
