import express from "express";
import axios from "axios";

const router = express.Router();

// 👇 temporary storage (abhi DB nahi use kar rahe)
let projects: any[] = [];

// ==============================
// 🔹 1. GitHub se repos fetch
// ==============================
router.get("/repos", async (req, res) => {
  const token = req.headers.authorization;

  console.log("TOKEN:", token);

  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: token,
      },
    });

    // 👇 try block properly close karna hai
    res.json(response.data);

  } catch (error: any) {
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);

    res.status(500).json({ error: "Failed to fetch repos" });
  }
});

// ==============================
// 🔹 2. Connect Repo API
// ==============================
router.post("/connect", (req, res) => {
  // 👇 frontend se repo data aa raha hai
  const { name, full_name } = req.body;

  // 👇 simple validation
  if (!name || !full_name) {
    return res.status(400).json({ error: "Invalid repo data" });
  }

  // 👇 repo ko store kar rahe (temporary)
  projects.push({ name, full_name });

  console.log("Connected Projects:", projects);

  res.json({
    message: "Project connected 🚀",
    projects,
  });
});

// ==============================
// 🔹 3. Get Connected Projects
// ==============================
router.get("/connected", (req, res) => {
  res.json(projects);
});

export default router;