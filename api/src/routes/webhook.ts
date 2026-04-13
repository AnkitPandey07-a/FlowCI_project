import express from "express";

const router = express.Router();

// 👇 GitHub webhook receive karega
router.post("/github", (req, res) => {
  console.log("📦 Webhook received!");

  const event = req.headers["x-github-event"];
  console.log("Event:", event);

  console.log("Payload:", req.body);

  res.status(200).send("Webhook received");
});

export default router;