import express from "express";
import axios from "axios";

const router = express.Router();

// 1️⃣ Redirect to GitHub
router.get("/github", (req, res) => {
    console.log("CLIENT ID:", process.env.GITHUB_CLIENT_ID);
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=http://localhost:5000/auth/github/callback`;
  res.redirect(url);
});

// 2️⃣ Callback
router.get("/github/callback", async (req, res) => {
  const code = req.query.code;

  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: { Accept: "application/json" },
    }
  );

  const accessToken = tokenRes.data.access_token;

  const userRes = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  res.json({
    user: userRes.data,
    accessToken,
  });
});

export default router;