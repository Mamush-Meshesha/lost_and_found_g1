import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import reportRoutes from "./routes/itemRoutes";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "MERN backend is running" });
});

app.use("/api/reports", reportRoutes);


const startApp = async () => {
  try {

    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Initialization failed:", error);
    process.exit(1);
  }
};

startApp();
