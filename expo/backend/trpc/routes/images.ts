import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { storage } from "../storage";

const DESIGN_STYLES = [
  "Modern",
  "Transitional",
  "Traditional",
  "Warm Minimal",
  "Contemporary",
  "Eclectic",
  "Organic / Natural",
  "Luxury",
] as const;

const ROOM_TYPES = [
  "Kitchen",
  "Living Room",
  "Dining Room",
  "Bedroom",
  "Bathroom",
  "Office / Study",
  "Entryway",
  "Outdoor",
  "Whole Home",
] as const;

export const imagesRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return storage.getImages();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return storage.getImageById(input.id);
    }),

  listByProject: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ input }) => {
      return storage.getImagesByProject(input.projectId);
    }),

  listByDesigner: publicProcedure
    .input(z.object({ designerId: z.string() }))
    .query(({ input }) => {
      return storage.getImagesByDesigner(input.designerId);
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        roomType: z.string().optional(),
        designStyle: z.string().optional(),
        projectType: z.string().optional(),
        designerId: z.string().optional(),
      })
    )
    .query(({ input }) => {
      return storage.searchImages(input);
    }),

  add: publicProcedure
    .input(
      z.object({
        project_id: z.string(),
        image_url: z.string().min(1),
        room_type: z.enum(ROOM_TYPES),
        style_tags: z.union([
          z.tuple([z.enum(DESIGN_STYLES)]),
          z.tuple([z.enum(DESIGN_STYLES), z.enum(DESIGN_STYLES)]),
        ]),
        sort_priority: z.number().default(1),
        aspect_ratio: z.number().default(1.3),
      })
    )
    .mutation(({ input }) => {
      const image = {
        id: `i_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        project_id: input.project_id,
        image_url: input.image_url,
        room_type: input.room_type,
        style_tags: input.style_tags,
        sort_priority: input.sort_priority,
        aspect_ratio: input.aspect_ratio,
      };
      return storage.addImage(image);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return storage.deleteImage(input.id);
    }),
});
