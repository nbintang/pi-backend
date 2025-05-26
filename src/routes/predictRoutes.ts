import express from 'express';
import { uploadSingleImage } from '../middleware/multer';
import { predictMeatController } from '../controller/predictMeatController';
const predictRoutes = express.Router();
predictRoutes.post('/predict', uploadSingleImage, predictMeatController);
export default predictRoutes;
