import express from 'express';
import * as tf from '@tensorflow/tfjs-node'; // Import TensorFlow.js for Node.js
import multer from 'multer';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

let model: tf.GraphModel;

(async () => {
  model = await tf.loadGraphModel(`file:///home/user/test-model/tfjs_model/model.json`);
})();

router.post('/predict', upload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400).send('No image uploaded.');
    return;
  }
  const imageBuffer = fs.readFileSync(req.file.path);
  const decodedImage = tf.node.decodeImage(imageBuffer as unknown as Uint8Array, 3).resizeBilinear([224, 224]);
  const inputTensor = decodedImage.expandDims(0).div(255.0); // normalisasi

  const prediction = model.predict(inputTensor) as tf.Tensor;
  const predictionArray = await prediction.data();

  const labels = ['Segar', 'Setengah Segar', 'Busuk'];
  const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));
  const label = labels[maxIndex];
  fs.unlinkSync(req.file.path); // hapus file setelah digunakan

  res.json({
      prediction: {
        label,
        confidence: predictionArray[maxIndex],
        raw: predictionArray
      }
    });
});

export default router;
