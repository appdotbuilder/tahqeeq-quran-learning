import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createUserInputSchema,
  updateUserInputSchema,
  createClassroomInputSchema,
  updateClassroomInputSchema,
  joinClassroomInputSchema,
  inviteStudentInputSchema,
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUser } from './handlers/get_user';
import { getUsers } from './handlers/get_users';
import { updateUser } from './handlers/update_user';
import { createClassroom } from './handlers/create_classroom';
import { getClassroom } from './handlers/get_classroom';
import { getClassroomsByEducator } from './handlers/get_classrooms_by_educator';
import { getClassroomsByStudent } from './handlers/get_classrooms_by_student';
import { updateClassroom } from './handlers/update_classroom';
import { joinClassroom } from './handlers/join_classroom';
import { inviteStudent } from './handlers/invite_student';
import { getClassroomMembers } from './handlers/get_classroom_members';
import { leaveClassroom } from './handlers/leave_classroom';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management routes
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  getUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getUser(input.id)),

  getUsers: publicProcedure
    .query(() => getUsers()),

  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),

  // Classroom management routes
  createClassroom: publicProcedure
    .input(createClassroomInputSchema)
    .mutation(({ input }) => createClassroom(input)),

  getClassroom: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getClassroom(input.id)),

  getClassroomsByEducator: publicProcedure
    .input(z.object({ educatorId: z.number() }))
    .query(({ input }) => getClassroomsByEducator(input.educatorId)),

  getClassroomsByStudent: publicProcedure
    .input(z.object({ studentId: z.number() }))
    .query(({ input }) => getClassroomsByStudent(input.studentId)),

  updateClassroom: publicProcedure
    .input(updateClassroomInputSchema)
    .mutation(({ input }) => updateClassroom(input)),

  // Classroom membership routes
  joinClassroom: publicProcedure
    .input(joinClassroomInputSchema)
    .mutation(({ input }) => joinClassroom(input)),

  inviteStudent: publicProcedure
    .input(inviteStudentInputSchema)
    .mutation(({ input }) => inviteStudent(input)),

  getClassroomMembers: publicProcedure
    .input(z.object({ classroomId: z.number() }))
    .query(({ input }) => getClassroomMembers(input.classroomId)),

  leaveClassroom: publicProcedure
    .input(z.object({ classroomId: z.number(), studentId: z.number() }))
    .mutation(({ input }) => leaveClassroom(input.classroomId, input.studentId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Tahqeeq TRPC server listening at port: ${port}`);
}

start();