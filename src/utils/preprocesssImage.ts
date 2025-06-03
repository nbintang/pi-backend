// utils/preprocesssImage.ts
import * as tf from '@tensorflow/tfjs-node'; 

export  function preprocessImage(imageBuffer: Buffer): tf.Tensor {
    const tensor = tf.node.decodeImage(imageBuffer);
    const resizedTensor = tf.image.resizeBilinear(tensor, [224, 224]);
    const normalizedTensor = resizedTensor.div(255.0); 
    const expandedTensor = normalizedTensor.expandDims(0);
    tf.dispose([tensor, resizedTensor, normalizedTensor]);
    return expandedTensor;
}