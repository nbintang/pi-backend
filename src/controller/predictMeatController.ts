import { predictImage as predictMeatService } from "../services/predictMeatServices";
import { HttpException } from "../utils/httpException";
import { preprocessImage } from "../utils/preprocesssImage";
import { Request, Response } from "express";
import fs from 'fs';
export const predictMeatController = async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).send('No image uploaded.');
        return;
    }
    try {
        const inputTensor = preprocessImage(req.file.path);
        const result = await predictMeatService(inputTensor);
        res.json(result)
    } catch (error: any) {
        throw new HttpException(error.message, 500);
    } finally {
        fs.unlinkSync(req.file.path); 
    }
}