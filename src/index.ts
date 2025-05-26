import express from 'express';
import myRoutes from './routes/predictRoutes';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.use('/api', myRoutes); // Use your routes under a base path like '/api'
app.get("/", (req, res) => {
  res.send("hello")
})
app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});