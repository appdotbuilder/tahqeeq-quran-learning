import { serial, text, pgTable, timestamp, integer, pgEnum, real, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define enums
export const userRoleEnum = pgEnum('user_role', ['student', 'educator', 'adult_learner', 'parent']);
export const classroomVisibilityEnum = pgEnum('classroom_visibility', ['private', 'public']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  // Progress tracking placeholders for future AI integration
  accuracy_percentage: real('accuracy_percentage'), // Nullable for new users
  common_mistakes: text('common_mistakes'), // JSON string of common mistake patterns
  points: integer('points').default(0).notNull(), // Gamification points
  streak_days: integer('streak_days').default(0).notNull(), // Current learning streak
  achievements: text('achievements'), // JSON string of earned achievements
});

// Classrooms table
export const classroomsTable = pgTable('classrooms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'), // Nullable description
  educator_id: integer('educator_id').notNull().references(() => usersTable.id),
  visibility: classroomVisibilityEnum('visibility').notNull(),
  invite_code: text('invite_code').notNull().unique(), // Unique invite code
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Classroom memberships table (many-to-many relationship)
export const classroomMembershipsTable = pgTable('classroom_memberships', {
  id: serial('id').primaryKey(),
  classroom_id: integer('classroom_id').notNull().references(() => classroomsTable.id),
  student_id: integer('student_id').notNull().references(() => usersTable.id),
  joined_at: timestamp('joined_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure a student can only join a classroom once
  uniqueMembership: unique().on(table.classroom_id, table.student_id),
}));

// Define relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  ownedClassrooms: many(classroomsTable), // Classrooms created by this educator
  memberships: many(classroomMembershipsTable), // Classroom memberships for students
}));

export const classroomsRelations = relations(classroomsTable, ({ one, many }) => ({
  educator: one(usersTable, {
    fields: [classroomsTable.educator_id],
    references: [usersTable.id],
  }),
  memberships: many(classroomMembershipsTable),
}));

export const classroomMembershipsRelations = relations(classroomMembershipsTable, ({ one }) => ({
  classroom: one(classroomsTable, {
    fields: [classroomMembershipsTable.classroom_id],
    references: [classroomsTable.id],
  }),
  student: one(usersTable, {
    fields: [classroomMembershipsTable.student_id],
    references: [usersTable.id],
  }),
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Classroom = typeof classroomsTable.$inferSelect;
export type NewClassroom = typeof classroomsTable.$inferInsert;

export type ClassroomMembership = typeof classroomMembershipsTable.$inferSelect;
export type NewClassroomMembership = typeof classroomMembershipsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  classrooms: classroomsTable,
  classroomMemberships: classroomMembershipsTable,
};