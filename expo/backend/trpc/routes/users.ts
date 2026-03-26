import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { storage } from "../storage";

export const usersRouter = createTRPCRouter({
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
      })
    )
    .mutation(({ input }) => {
      return storage.upsertUser({ email: input.email, name: input.name });
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return storage.getUser(input.id);
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ input }) => {
      return storage.getUserByEmail(input.email);
    }),

  list: publicProcedure.query(() => {
    return storage.getAllUsers();
  }),

  updateProfile: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
      })
    )
    .mutation(({ input }) => {
      return storage.upsertUser({ email: input.email, name: input.name });
    }),
});
