import { uploadImgServices as storeImagetoCloudinary } from "../services/imgServices";
import { createHistoryMeat, getMeatsHistory, predictMeatService } from "../services/meatServices";
import sharp from 'sharp';
import { preprocessImage } from "../utils/preprocesssImage";
import { Request, Response } from "express";


export const predictMeatController = async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).send('No image uploaded.');
        return;
    }
    try {
        const fileBUffer = req.file.buffer;
        const folder = "meat-predictions";

        //prediksi gambar daging disini
        const inputTensor = preprocessImage(fileBUffer);
        const { prediction: { ...result } } = await predictMeatService(inputTensor);

        // optimasi gambar
        const optimizedBuffer = await sharp(fileBUffer)
            .resize(1000, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .jpeg({ quality: 80, progressive: true })
            .toBuffer();

        // janlup simpan gambar yang telah dioptimasi ke media cloudinary ya wok
        const { secure_url, public_id } = await storeImagetoCloudinary({
            buffer: optimizedBuffer,
            folder,
            public_id: `${folder}-${Date.now()}`
        });


        const newMeat = await createHistoryMeat({
            name: public_id,
            image: secure_url,
            confidence: result.confidence,
            category: result.label,
            rawProbability: result.raw.probability,
        })

        const meatCategory = `${result.label[0]}${result.label.slice(1).toLowerCase()}`;
        res.json({
            status_code: 201,
            message: `Success to predict!, your meat is ${meatCategory}!`,
            data: newMeat,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};



export const getMeatController = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        const meat = await getMeatsHistory(limit, offset);
        res.json({
            status_code: 200,
            message: 'Success to get meat history',
            data: meat,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}