import { z } from 'zod';

// User role enum
export const userRoleSchema = z.enum(['student', 'educator', 'adult_learner', 'parent']);
export type UserRole = z.infer<typeof userRoleSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  role: userRoleSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  // Progress tracking placeholders for future AI integration
  accuracy_percentage: z.number().min(0).max(100).nullable(), // Overall accuracy percentage
  common_mistakes: z.string().nullable(), // JSON string of common mistake patterns
  points: z.number().int().nonnegative(), // Gamification points
  streak_days: z.number().int().nonnegative(), // Current learning streak
  achievements: z.string().nullable(), // JSON string of earned achievements
});

export type User = z.infer<typeof userSchema>;

// Input schema for creating users
export const createUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: userRoleSchema,
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Input schema for updating users
export const updateUserInputSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  role: userRoleSchema.optional(),
  accuracy_percentage: z.number().min(0).max(100).nullable().optional(),
  common_mistakes: z.string().nullable().optional(),
  points: z.number().int().nonnegative().optional(),
  streak_days: z.number().int().nonnegative().optional(),
  achievements: z.string().nullable().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Classroom visibility enum
export const classroomVisibilitySchema = z.enum(['private', 'public']);
export type ClassroomVisibility = z.infer<typeof classroomVisibilitySchema>;

// Classroom schema
export const classroomSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  educator_id: z.number(), // Foreign key to users table
  visibility: classroomVisibilitySchema,
  invite_code: z.string(), // Unique code for students to join
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Classroom = z.infer<typeof classroomSchema>;

// Input schema for creating classrooms
export const createClassroomInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  educator_id: z.number(),
  visibility: classroomVisibilitySchema,
});

export type CreateClassroomInput = z.infer<typeof createClassroomInputSchema>;

// Input schema for updating classrooms
export const updateClassroomInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  visibility: classroomVisibilitySchema.optional(),
});

export type UpdateClassroomInput = z.infer<typeof updateClassroomInputSchema>;

// Classroom membership schema
export const classroomMembershipSchema = z.object({
  id: z.number(),
  classroom_id: z.number(), // Foreign key to classrooms table
  student_id: z.number(), // Foreign key to users table
  joined_at: z.coerce.date(),
});

export type ClassroomMembership = z.infer<typeof classroomMembershipSchema>;

// Input schema for joining classroom
export const joinClassroomInputSchema = z.object({
  invite_code: z.string(),
  student_id: z.number(),
});

export type JoinClassroomInput = z.infer<typeof joinClassroomInputSchema>;

// Input schema for inviting student to classroom
export const inviteStudentInputSchema = z.object({
  classroom_id: z.number(),
  student_id: z.number(),
});

export type InviteStudentInput = z.infer<typeof inviteStudentInputSchema>;

// Schema for classroom with member count (for list views)
export const classroomWithStatsSchema = classroomSchema.extend({
  member_count: z.number().int().nonnegative(),
  educator_name: z.string(),
});

export type ClassroomWithStats = z.infer<typeof classroomWithStatsSchema>;