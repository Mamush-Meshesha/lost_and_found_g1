import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// 1. Import the DB config and routes
import { connectDB } from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js"

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB(); // 2. Execute the connection

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Register the Category routes
app.use("/api/categories", categoryRoutes);

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "server  is running" });
});

app.use("/api/items", itemRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});