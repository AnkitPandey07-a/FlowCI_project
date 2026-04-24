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
// 🔥 webhook ke liye raw body
app.use(
  "/webhook/github",
  express.raw({ type: "application/json" })
);

// 🔥 webhook routes
app.use("/webhook", webhookRoutes);


// bakki routes ke liye json middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

//routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

//test route
app.get("/", (req, res) => {
  res.send("FlowCI API running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});