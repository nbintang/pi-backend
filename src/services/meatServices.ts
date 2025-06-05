// src/services/predictMeatServices.ts
import * as tf from '@tensorflow/tfjs-node';
import { HttpException } from '../utils/httpException';
import db from '../lib/db';
import { Category, Prisma } from '../../prisma/client';

let model: tf.GraphModel | null = null;

export const setModel = (loadedModel: tf.GraphModel) => {
    model = loadedModel;
};

export const predictMeatService = async (tensor: tf.Tensor) => {
    if (!model) throw new HttpException('Model not loaded yet.', 401);

    const prediction = model.predict(tensor) as tf.Tensor;
    const predictionArray = await prediction.data();
    const confidenceRaw = predictionArray[0]; // output sigmoid
    const isBusuk = confidenceRaw >= 0.5;

    const label = isBusuk ? Category.SPOILED : Category.FRESH;
    const confidence = isBusuk
        ? Math.round(confidenceRaw * 10000) / 100 // Busuk: 0.97 → 97%
        : Math.round((1 - confidenceRaw) * 10000) / 100; // Segar: 0.0001 → 99.99%

    return {
        prediction: {
            label,
            confidence,
            raw: { probability: confidenceRaw }
        }
    };
};

export const createHistoryMeat = async (data: Prisma.MeatCreateInput) => {
    const newMeat = await db.meat.create({ data })
    return newMeat
}
export const getMeatsHistory = async (limit: number, offset: number) => {
    const meat = await db.meat.findMany({
        orderBy: {
            createdAt: 'desc'

        },
        take: limit,
        skip: offset
    })
    return meat
}
