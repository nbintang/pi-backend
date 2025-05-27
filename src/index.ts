import express from 'express';
import myRoutes from './routes/predictRoutes';
import { errorHandler } from './utils/httpException';
import * as tf from '@tensorflow/tfjs-node'; // Import TensorFlow.js for Node.js
import { setModel } from './services/predictMeatServices';

const basePath = "file://./";
const app = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const model = await tf.loadGraphModel(`${basePath}ml-models/tfjs_model/model.json`);
    setModel(model);
    app.use(express.json());
    app.use(errorHandler);
    app.use('/api', myRoutes);
    app.get("/", (req, res) => {
      res.send("hello");
    });

    app.listen(port, () => {
      console.log(`listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to load model:", err);
    process.exit(1);
  }
};

startServer();