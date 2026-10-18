import { index, integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

export const activityEvents = sqliteTable("activity_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: text("kind").notNull(),
  page: text("page").notNull(),
  details: text("details").notNull(),
  createdAt: integer("created_at").notNull(),
}, table => [index("idx_activity_created").on(table.createdAt), index("idx_activity_user_created").on(table.userId,table.createdAt)]);

export const practiceDays = sqliteTable("practice_days", {
  userId: text("user_id").notNull(),
  day: text("day").notNull(),
  createdAt: integer("created_at").notNull(),
}, table => [primaryKey({columns:[table.userId, table.day]})]);

export const sprintFeedbackPrompts = sqliteTable("sprint_feedback_prompts", {
  userId: text("user_id").primaryKey(),
  shownAt: integer("shown_at").notNull(),
});

export const feedbackNotices = sqliteTable("feedback_notices", {
  userId: text("user_id").primaryKey(),
  seenAt: integer("seen_at").notNull(),
});

export const siteFeedback = sqliteTable("site_feedback", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: text("kind").notNull(),
  message: text("message").notNull(),
  page: text("page").notNull(),
  context: text("context").notNull().default("{}"),
  createdAt: integer("created_at").notNull(),
}, table => [index("idx_site_feedback_created").on(table.createdAt),index("idx_site_feedback_user_created").on(table.userId,table.createdAt)]);

export const duelRooms = sqliteTable("duel_rooms", {
  code: text("code").primaryKey(),
  hostToken: text("host_token").notNull(),
  guestToken: text("guest_token"),
  questions: text("questions").notNull(),
  status: text("status").notNull().default("waiting"),
  round: integer("round").notNull().default(0),
  hostScore: integer("host_score").notNull().default(0),
  guestScore: integer("guest_score").notNull().default(0),
  lastWinner: text("last_winner"),
  winner: text("winner"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const functionSprintSessions = sqliteTable(
  "function_sprint_sessions",
  {
    id: text("id").primaryKey(),
    deviceId: text("device_id").notNull(),
    userId: text("user_id"),
    completedOn: text("completed_on").notNull(),
    questions: integer("questions").notNull(),
    firstCorrect: integer("first_correct").notNull(),
    solved: integer("solved").notNull(),
    misses: integer("misses").notNull(),
    totalMs: integer("total_ms").notNull(),
    section: text("section").notNull().default("unknown"),
    difficulty: text("difficulty").notNull().default("standard"),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    index("idx_function_sprint_device_day").on(table.deviceId, table.completedOn),
    index("idx_function_sprint_user_created").on(table.userId, table.createdAt),
  ]
);

export const functionSprintUsers = sqliteTable("function_sprint_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  createdAt: integer("created_at").notNull(),
  lastSeenAt: integer("last_seen_at").notNull(),
});

export const localAccounts = sqliteTable("local_accounts", {
  userId: text("user_id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  iterations: integer("iterations").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const authSessions = sqliteTable(
  "auth_sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    userId: text("user_id").notNull(),
    expiresAt: integer("expires_at").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    index("idx_auth_sessions_user").on(table.userId),
    index("idx_auth_sessions_expires").on(table.expiresAt),
  ]
);

export const functionSprintPlayers = sqliteTable("function_sprint_players", {
  deviceId: text("device_id").primaryKey(),
  displayName: text("display_name").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const usageEvents = sqliteTable(
  "usage_events",
  {
    id: text("id").primaryKey(),
    deviceId: text("device_id").notNull(),
    displayName: text("display_name"),
    userId: text("user_id"),
    page: text("page").notNull(),
    eventType: text("event_type").notNull(),
    occurredOn: text("occurred_on").notNull(),
    durationMs: integer("duration_ms").notNull().default(0),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    index("idx_usage_events_created").on(table.createdAt),
    index("idx_usage_events_page_day").on(table.page, table.occurredOn),
    index("idx_usage_events_device_created").on(table.deviceId, table.createdAt),
    index("idx_usage_events_user_created").on(table.userId, table.createdAt),
  ]
);
