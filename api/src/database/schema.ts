// backend/src/db/schema.ts

import { pgTable, uuid, text, timestamp, integer, pgEnum, boolean } from 'drizzle-orm/pg-core'

// Build ke possible states
export const buildStatusEnum = pgEnum('build_status', [
  'queued',    // Queue mein wait kar raha hai
  'running',   // Abhi chal raha hai
  'success',   // Pass ho gaya
  'failed',    // Fail ho gaya
  'cancelled', // Cancel kiya
])

export const stepStatusEnum = pgEnum('step_status', [
  'pending', 'running', 'success', 'failed', 'skipped'
])

// Users — GitHub se login karte hain
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  githubId: text('github_id').unique().notNull(),  // GitHub ka user ID
  githubUsername: text('github_username').notNull(),
  githubToken: text('github_token'),               // Encrypted GitHub access token
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Projects — connected GitHub repos
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  repoFullName: text('repo_full_name').notNull(), // "username/repo"
  repoUrl: text('repo_url').notNull(),
  defaultBranch: text('default_branch').default('main'),
  webhookSecret: text('webhook_secret').notNull(), // Webhook verify karne ke liye
  webhookId: text('webhook_id'),                   // GitHub ne diya ID
  isActive: boolean('is_active').default(true),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
})

// Builds — har pipeline run
export const builds = pgTable('builds', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  commitSha: text('commit_sha').notNull(),
  commitMessage: text('commit_message'),
  commitAuthor: text('commit_author'),
  branch: text('branch').notNull(),
  status: buildStatusEnum('status').default('queued'),
  startedAt: timestamp('started_at'),
  finishedAt: timestamp('finished_at'),
  duration: integer('duration'), // seconds mein
  createdAt: timestamp('created_at').defaultNow(),
})

// Steps — har build ke andar individual steps
export const steps = pgTable('steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  buildId: uuid('build_id').references(() => builds.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  dockerImage: text('docker_image').notNull(),
  command: text('command').notNull(),
  status: stepStatusEnum('status').default('pending'),
  exitCode: integer('exit_code'),
  order: integer('order').notNull(),
  startedAt: timestamp('started_at'),
  finishedAt: timestamp('finished_at'),
  duration: integer('duration'),
})

// Logs — har step ke terminal output
export const logs = pgTable('logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  stepId: uuid('step_id').references(() => steps.id, { onDelete: 'cascade' }),
  line: integer('line').notNull(),
  content: text('content').notNull(),
  isError: boolean('is_error').default(false), // stderr hai toh true
  timestamp: timestamp('timestamp').defaultNow(),
})

// TypeScript types — schema se automatically generate hote hain
export type User = typeof users.$inferSelect
export type Project = typeof projects.$inferSelect
export type Build = typeof builds.$inferSelect
export type Step = typeof steps.$inferSelect