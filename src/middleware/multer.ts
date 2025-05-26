
import multer from 'multer';
import path from 'path';
import { HttpException } from '../utils/httpException';

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isValid = ['.jpg', '.jpeg'].includes(ext);

  if (isValid) cb(null, true);
  else cb(new HttpException('Only image files are allowed!'));
};

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
});

export const uploadSingleImage = upload.single('image');
