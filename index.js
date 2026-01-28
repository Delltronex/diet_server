import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai_routes.js";

dotenv.config();

const app = express();

// Allow requests from anywhere (safe for demo/project)
app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);

// Render provides PORT automatically
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on Render on port ${PORT}`);
});
