import { configDotenv } from 'dotenv';
configDotenv();

import express, { ErrorRequestHandler } from 'express';
import myRoutes from './routes/predictRoutes';
import { errorHandler } from './utils/httpException';
import * as tf from '@tensorflow/tfjs-node';
import { setModel } from './services/meatServices';
import cors from 'cors';
import logger from './lib/logger';
import pinoHttp from "pino-http";

const basePath = "file://.";
const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  const modelMainPath = "tfjs_best_model";
  const modelPath = `${basePath}/ml-models/${modelMainPath}/model.json`;
  try {
    const model = await tf.loadGraphModel(modelPath);
    setModel(model);
    app.use(cors()); // This allows all origins
    app.use(express.json());
    app.use(pinoHttp({ logger })); // Pass the created logger instance
    app.use('/api/meat', myRoutes);
    app.get("/", (req, res) => {
      res.json({ message: "Hello World!" });
    });
    app.use(errorHandler as ErrorRequestHandler);
    app.listen(PORT, () => {
      logger.info(`Server running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("❌ Failed to load model or start server:", err);
    process.exit(1);
  }
};

startServer();
