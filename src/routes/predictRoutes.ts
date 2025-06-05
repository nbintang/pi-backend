import express from 'express';
import { uploadSingleImage } from '../middleware/multer';
import { getMeatController, predictMeatController } from '../controller/meatController';
const predictRoutes = express.Router();

predictRoutes.get('/', getMeatController);
predictRoutes.post('/predict', uploadSingleImage, predictMeatController);
export default predictRoutes;
