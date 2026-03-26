import { createTRPCRouter } from "./create-context";
import { designersRouter } from "./routes/designers";
import { projectsRouter } from "./routes/projects";
import { imagesRouter } from "./routes/images";
import { usersRouter } from "./routes/users";
import { adminRouter } from "./routes/admin";
import { savesRouter } from "./routes/saves";
import { boardsRouter } from "./routes/boards";
import { inquiriesRouter } from "./routes/inquiries";

export const appRouter = createTRPCRouter({
  designers: designersRouter,
  projects: projectsRouter,
  images: imagesRouter,
  users: usersRouter,
  admin: adminRouter,
  saves: savesRouter,
  boards: boardsRouter,
  inquiries: inquiriesRouter,
});

export type AppRouter = typeof appRouter;
