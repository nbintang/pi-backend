// src/services/predictMeatServices.ts
import * as tf from '@tensorflow/tfjs-node';
import { HttpException } from '../utils/httpException';

let model: tf.GraphModel | null = null;

export const setModel = (loadedModel: tf.GraphModel) => {
    model = loadedModel;
};

export const predictImage = async (tensor: tf.Tensor) => {
    if (!model) throw new HttpException('Model not loaded yet.', 401);
    
    const prediction = model.predict(tensor) as tf.Tensor;
    const predictionArray = await prediction.data();
    const confidenceRaw = predictionArray[0]; // output sigmoid
    const isBusuk = confidenceRaw >= 0.5;
    
    const label = isBusuk ? 'Busuk' : 'Segar';
    const confidence = isBusuk
      ? Math.round(confidenceRaw * 10000) / 100 // Busuk: 0.97 → 97%
      : Math.round((1 - confidenceRaw) * 10000) / 100; // Segar: 0.0001 → 99.99%

    return {
        prediction: {
            label,
            confidence, // ✅ persentase yang intuitif
            raw: { probability: confidenceRaw } // tetap disimpan originalnya
        }
    };
};

