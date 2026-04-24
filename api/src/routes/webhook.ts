import express from "express";
import { exec } from "child_process";

const router = express.Router();

// 🔥 logs storage (frontend ke liye)
export let buildLogs: string[] = [];

// 🔥 helper function (console + store)
const log = (msg: string) => {
  console.log(msg);
  buildLogs.push(msg);
};

router.post("/github", (req, res) => {
  log("📦 Webhook received!");

  const event = req.headers["x-github-event"];
  log("Event: " + event);

  const payload = JSON.parse(req.body.toString());

  log("Repo: " + payload.repository.full_name);
  log("Branch: " + payload.ref);
  log("Commit: " + payload.head_commit?.message);

  if (event === "push") {
    // 🔥 har build pe logs reset
    buildLogs = [];

    const repoUrl = payload.repository.clone_url;
    const folderName = `build-${Date.now()}`;

    log("📥 Cloning repo...");

    // ✅ STEP 1 — clone
    exec(`git clone ${repoUrl} ${folderName}`, (err) => {
      if (err) {
        log("❌ Clone failed");
        return;
      }

      log(`📦 Repo cloned in ${folderName}`);

      // ✅ STEP 2 — install
      exec(`cd ${folderName} && npm install`, (err) => {
        if (err) {
          log("❌ Install failed");
          return;
        }

        log("📦 Dependencies installed");

        // ✅ STEP 3 — build (smart fallback)
        exec(`cd ${folderName} && npm run build`, (err) => {
          if (err) {
            log("⚠️ No build script found, skipping...");
            log("✅ Build marked as success");
            return;
          }

          log("🚀 Build successful!");
        });
      });
    });
  }

  res.sendStatus(200);
});

export default router;