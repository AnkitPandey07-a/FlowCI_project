// // api/src/routes/builds.ts

// import express, { Request, Response } from 'express'
// import { db } from '../database/client'
// import { builds, steps, logs, projects } from '../database/schema'
// import { eq, and, desc } from 'drizzle-orm'
// import { authMiddleware } from '../middleware/auth'

// const router = express.Router()
// router.use(authMiddleware)

// // ─── GET /builds/project/:projectId — Project ki sab builds ───────────────────
// router.get('/project/:projectId', async (req: Request, res: Response) => {
//   try {
//     const projectBuilds = await db
//       .select()
//       .from(builds)
//       .where(eq(builds.projectId, req.params.projectId))
//       .orderBy(desc(builds.createdAt))
//       .limit(20)

//     return res.json({ builds: projectBuilds })
//   } catch (error) {
//     return res.status(500).json({ error: 'Builds fetch nahi hue' })
//   }
// })

// // ─── GET /builds/:id — Single build + uske steps ──────────────────────────────
// router.get('/:id', async (req: Request, res: Response) => {
//   try {
//     const [build] = await db
//       .select()
//       .from(builds)
//       .where(eq(builds.id, req.params.id))
//       .limit(1)

//     if (!build) {
//       return res.status(404).json({ error: 'Build nahi mili' })
//     }

//     // Build ke saath steps bhi bhejo
//     const buildSteps = await db
//       .select()
//       .from(steps)
//       .where(eq(steps.buildId, build.id))
//       .orderBy(steps.order)

//     return res.json({ build, steps: buildSteps })
//   } catch (error) {
//     return res.status(500).json({ error: 'Build fetch nahi hui' })
//   }
// })

// // ─── GET /builds/:id/logs/:stepId — Step ke logs ──────────────────────────────
// router.get('/:id/logs/:stepId', async (req: Request, res: Response) => {
//   try {
//     const stepLogs = await db
//       .select()
//       .from(logs)
//       .where(eq(logs.stepId, req.params.stepId))
//       .orderBy(logs.line)

//     return res.json({ logs: stepLogs })
//   } catch (error) {
//     return res.status(500).json({ error: 'Logs fetch nahi hue' })
//   }
// })

// // ─── POST /builds/trigger — Manual build trigger ──────────────────────────────
// router.post('/trigger', async (req: Request, res: Response) => {
//   try {
//     const { projectId } = req.body

//     // Project ownership verify karo
//     const [project] = await db
//       .select()
//       .from(projects)
//       .where(
//         and(
//           eq(projects.id, projectId),
//           eq(projects.ownerId, req.user!.id)
//         )
//       )
//       .limit(1)

//     if (!project) {
//       return res.status(404).json({ error: 'Project nahi mila' })
//     }

//     // Manual build create karo
//     const [newBuild] = await db
//       .insert(builds)
//       .values({
//         projectId,
//         commitSha: 'manual',
//         commitMessage: `Manual trigger by ${req.user!.name}`,
//         commitAuthor: req.user!.name,
//         branch: project.defaultBranch || 'main',
//         status: 'queued',
//       })
//       .returning()

//     return res.status(201).json({
//       message: 'Build queue mein daal di! 🚀',
//       build: newBuild,
//     })
//   } catch (error) {
//     return res.status(500).json({ error: 'Build trigger nahi hua' })
//   }
// })

// export default router