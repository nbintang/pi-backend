
import multer from 'multer';
import path from 'path';
import { HttpException } from '../utils/httpException';

const validExtensionImage = [".jpeg"]

const fileFilter = (_: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isValid = [...validExtensionImage].includes(ext);

  if (isValid) {
    callback(null, true);
  } else {
    const allowedExtensions = validExtensionImage.map((ext) => ext.replace('.', '')).join(', ');
    callback(new HttpException(`Only ${allowedExtensions} image files are allowed!`, 400));
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadSingleImage = upload.single('image');
