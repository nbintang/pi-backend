// src/utils/imageUtils.ts
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

export const preprocessImage = (path: string) => {
  const imageBuffer = fs.readFileSync(path);
  const decodedImage = tf.node.decodeImage(imageBuffer as Uint8Array, 3)
    .resizeBilinear([224, 224]);
  return decodedImage.expandDims(0).div(255.0); // Normalize
};