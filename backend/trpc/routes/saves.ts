import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { storage } from "../storage";

export const savesRouter = createTRPCRouter({
  listByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return storage.getSavesByUser(input.userId);
    }),

  save: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        imageId: z.string(),
      })
    )
    .mutation(({ input }) => {
      return storage.saveImage(input.userId, input.imageId);
    }),

  unsave: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        imageId: z.string(),
      })
    )
    .mutation(({ input }) => {
      return storage.unsaveImage(input.userId, input.imageId);
    }),

  isSaved: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        imageId: z.string(),
      })
    )
    .query(({ input }) => {
      return storage.isImageSaved(input.userId, input.imageId);
    }),

  moveToBoard: publicProcedure
    .input(
      z.object({
        saveId: z.string(),
        boardId: z.string().nullable(),
      })
    )
    .mutation(({ input }) => {
      return storage.moveToBoard(input.saveId, input.boardId);
    }),

  listByBoard: publicProcedure
    .input(z.object({ boardId: z.string() }))
    .query(({ input }) => {
      return storage.getSavesByBoard(input.boardId);
    }),
});
