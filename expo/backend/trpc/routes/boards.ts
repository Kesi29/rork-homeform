import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { storage } from "../storage";

export const boardsRouter = createTRPCRouter({
  listByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return storage.getBoardsByUser(input.userId);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return storage.getBoardById(input.id);
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().min(1),
      })
    )
    .mutation(({ input }) => {
      return storage.createBoard(input.userId, input.name);
    }),

  rename: publicProcedure
    .input(
      z.object({
        boardId: z.string(),
        name: z.string().min(1),
      })
    )
    .mutation(({ input }) => {
      return storage.renameBoard(input.boardId, input.name);
    }),

  delete: publicProcedure
    .input(z.object({ boardId: z.string() }))
    .mutation(({ input }) => {
      return storage.deleteBoard(input.boardId);
    }),
});
