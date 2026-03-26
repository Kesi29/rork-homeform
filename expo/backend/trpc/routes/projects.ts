import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { storage } from "../storage";

export const projectsRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return storage.getProjects();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return storage.getProjectById(input.id);
    }),

  listByDesigner: publicProcedure
    .input(z.object({ designerId: z.string() }))
    .query(({ input }) => {
      return storage.getProjectsByDesigner(input.designerId);
    }),

  add: publicProcedure
    .input(
      z.object({
        designer_id: z.string(),
        project_name: z.string().min(1),
        project_type: z.enum([
          "Apartment",
          "Condo",
          "Single-Family Home",
          "Renovation",
          "New Build",
        ]),
        city: z.string().default("Chicago"),
      })
    )
    .mutation(({ input }) => {
      const project = {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        designer_id: input.designer_id,
        project_name: input.project_name,
        project_type: input.project_type,
        city: input.city,
      };
      return storage.addProject(project);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        project_name: z.string().optional(),
        project_type: z
          .enum([
            "Apartment",
            "Condo",
            "Single-Family Home",
            "Renovation",
            "New Build",
          ])
          .optional(),
        city: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return storage.updateProject(id, data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return storage.deleteProject(input.id);
    }),
});
