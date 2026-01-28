import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai_routes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/ai", aiRoutes);

// IMPORTANT: Render-compatible port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Groq backend running on port ${PORT}`);
});
