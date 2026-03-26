import { createTRPCRouter, publicProcedure } from "../create-context";
import { storage } from "../storage";

export const adminRouter = createTRPCRouter({
  reset: publicProcedure.mutation(() => {
    return storage.resetToDefaults();
  }),

  stats: publicProcedure.query(() => {
    return {
      designers: storage.getDesigners().length,
      projects: storage.getProjects().length,
      images: storage.getImages().length,
      users: storage.getAllUsers().length,
      saves: storage.getTotalSaves(),
      boards: storage.getTotalBoards(),
      inquiries: storage.getInquiries().length,
    };
  }),
});
