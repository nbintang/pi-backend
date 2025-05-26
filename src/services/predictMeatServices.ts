import * as tf from '@tensorflow/tfjs-node'; // Import TensorFlow.js for Node.js
import { HttpException } from '../utils/httpException';

let model: tf.GraphModel | null = null;

export const setModel = (loadedModel: tf.GraphModel) => {
  model = loadedModel;
};

export const predictImage = async (tensor: tf.Tensor) => {
    if (!model) throw new HttpException('Model not loaded yet.');
    const prediction = model.predict(tensor) as tf.Tensor;
    const predictionArray = await prediction.data();
    const labels = ['Segar', 'Setengah Segar', 'Busuk'];
    const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));
    const label = labels[maxIndex];
    return {
        prediction: {
            label,
            confidence: predictionArray[maxIndex],
            raw: predictionArray
        }
    }
}
