import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes";
import { connectDB } from "./config/db";
import categoryRoutes from "./routes/categoryRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});