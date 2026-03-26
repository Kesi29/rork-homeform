import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { storage } from "../storage";

export const inquiriesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        designer_id: z.string(),
        name: z.string().min(1),
        email: z.string().email(),
        zip_code: z.string().min(1),
        message: z.string().default(""),
      })
    )
    .mutation(({ input }) => {
      return storage.createInquiry({
        user_id: input.user_id,
        designer_id: input.designer_id,
        name: input.name,
        email: input.email,
        zip_code: input.zip_code,
        message: input.message,
      });
    }),

  listByDesigner: publicProcedure
    .input(z.object({ designerId: z.string() }))
    .query(({ input }) => {
      return storage.getInquiriesByDesigner(input.designerId);
    }),

  listByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return storage.getInquiriesByUser(input.userId);
    }),

  list: publicProcedure.query(() => {
    return storage.getInquiries();
  }),
});
