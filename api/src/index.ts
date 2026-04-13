import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import projectRoutes from './routes/projects'
import path from "path";
import webhookRoutes from "./routes/webhook";
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
const app = express();

// Webhook route pehle register karna hai, kyunki uske liye raw body
//  chahiye hoti hai signature verification ke liye.
//  Baaki routes ke liye JSON middleware use karenge.
app.use("/webhook", webhookRoutes);

// ⚠️ Webhook route pehle — raw body chahiye signature verify ke liye
app.post(
  '/webhook/github',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    if (req.body instanceof Buffer) {
      req.body = JSON.parse(req.body.toString())
    }
    next()
  }
)
// Webhook router use karo

// Baaki routes ke liye JSON middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json())
// routes connect kr rahe hain
app.use("/auth", authRoutes);

app.use("/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("FlowCI API running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});