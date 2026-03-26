import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { storage } from "../storage";

export const designersRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return storage.getDesigners();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return storage.getDesignerById(input.id);
    }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => {
      return storage.searchDesigners(input.query);
    }),

  add: publicProcedure
    .input(
      z.object({
        studio_name: z.string().min(1),
        bio: z.string().default(""),
        city: z.string().default("Chicago"),
        website_url: z.string().default(""),
        instagram_url: z.string().default(""),
        featured: z.boolean().default(false),
        avatar_url: z.string().default(""),
      })
    )
    .mutation(({ input }) => {
      const designer = {
        id: `d_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        studio_name: input.studio_name,
        bio: input.bio,
        city: input.city,
        website_url: input.website_url,
        instagram_url: input.instagram_url,
        featured: input.featured,
        avatar_url:
          input.avatar_url ||
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      };
      return storage.addDesigner(designer);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        studio_name: z.string().optional(),
        bio: z.string().optional(),
        city: z.string().optional(),
        website_url: z.string().optional(),
        instagram_url: z.string().optional(),
        featured: z.boolean().optional(),
        avatar_url: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return storage.updateDesigner(id, data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return storage.deleteDesigner(input.id);
    }),
});
