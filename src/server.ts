import { configDotenv } from 'dotenv';
configDotenv();

import express, { ErrorRequestHandler } from 'express';
import myRoutes from './routes/predictRoutes';
import { errorHandler } from './utils/httpException';
import * as tf from '@tensorflow/tfjs-node';
import { setModel } from './services/predictMeatServices';

const basePath = "file://.";
const app = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const model = await tf.loadGraphModel(`${basePath}/ml-models/tfjs_best_model/model.json`);
    setModel(model);
    app.use(express.json());
    app.use('/api', myRoutes);
    app.get("/", (req, res) => {
     
      res.json({ message: "Hello World!" });
    });
    app.use(errorHandler as ErrorRequestHandler);
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to load model:", err);
    process.exit(1);
  }
};



startServer();
