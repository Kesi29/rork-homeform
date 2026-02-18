import { Designer, Project, DesignImage, Board, Save, Inquiry } from "@/types";
import {
  designers as mockDesigners,
  projects as mockProjects,
  images as mockImages,
} from "@/mocks/data";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: "homeowner" | "admin";
  created_at: string;
}

class InMemoryStorage {
  designers: Designer[] = [...mockDesigners];
  projects: Project[] = [...mockProjects];
  images: DesignImage[] = [...mockImages];
  users: UserRecord[] = [];
  saves: Save[] = [];
  boards: Board[] = [];
  inquiries: Inquiry[] = [];

  // ── Designers ──

  getDesigners() {
    return this.designers;
  }

  getDesignerById(id: string) {
    return this.designers.find((d) => d.id === id) ?? null;
  }

  searchDesigners(query: string) {
    const q = query.toLowerCase();
    return this.designers.filter(
      (d) =>
        d.studio_name.toLowerCase().includes(q) ||
        d.bio.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q)
    );
  }

  addDesigner(designer: Designer) {
    this.designers.push(designer);
    return designer;
  }

  updateDesigner(id: string, data: Partial<Designer>) {
    const idx = this.designers.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.designers[idx] = { ...this.designers[idx], ...data };
    return this.designers[idx];
  }

  deleteDesigner(id: string) {
    const projectIds = this.projects
      .filter((p) => p.designer_id === id)
      .map((p) => p.id);
    this.designers = this.designers.filter((d) => d.id !== id);
    this.projects = this.projects.filter((p) => p.designer_id !== id);
    this.images = this.images.filter(
      (i) => !projectIds.includes(i.project_id)
    );
    return { success: true };
  }

  // ── Projects ──

  getProjects() {
    return this.projects;
  }

  getProjectById(id: string) {
    return this.projects.find((p) => p.id === id) ?? null;
  }

  getProjectsByDesigner(designerId: string) {
    return this.projects.filter((p) => p.designer_id === designerId);
  }

  addProject(project: Project) {
    this.projects.push(project);
    return project;
  }

  updateProject(id: string, data: Partial<Project>) {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = { ...this.projects[idx], ...data };
    return this.projects[idx];
  }

  deleteProject(id: string) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.images = this.images.filter((i) => i.project_id !== id);
    return { success: true };
  }

  // ── Images ──

  getImages() {
    return this.images;
  }

  getImageById(id: string) {
    return this.images.find((i) => i.id === id) ?? null;
  }

  getImagesByProject(projectId: string) {
    return this.images.filter((i) => i.project_id === projectId);
  }

  getImagesByDesigner(designerId: string) {
    const projectIds = this.projects
      .filter((p) => p.designer_id === designerId)
      .map((p) => p.id);
    return this.images.filter((i) => projectIds.includes(i.project_id));
  }

  searchImages(filters: {
    query?: string;
    roomType?: string;
    designStyle?: string;
    projectType?: string;
    designerId?: string;
  }) {
    let results = [...this.images];

    if (filters.designerId) {
      const projectIds = this.projects
        .filter((p) => p.designer_id === filters.designerId)
        .map((p) => p.id);
      results = results.filter((i) => projectIds.includes(i.project_id));
    }

    if (filters.roomType) {
      results = results.filter((i) => i.room_type === filters.roomType);
    }

    if (filters.designStyle) {
      results = results.filter((i) =>
        i.style_tags.includes(filters.designStyle as any)
      );
    }

    if (filters.projectType) {
      results = results.filter((i) => {
        const project = this.projects.find((p) => p.id === i.project_id);
        return project?.project_type === filters.projectType;
      });
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter((i) => {
        const project = this.projects.find((p) => p.id === i.project_id);
        const designer = project
          ? this.designers.find((d) => d.id === project.designer_id)
          : null;
        return (
          i.room_type.toLowerCase().includes(q) ||
          i.style_tags.some((t) => t.toLowerCase().includes(q)) ||
          (project?.project_name.toLowerCase().includes(q) ?? false) ||
          (designer?.studio_name.toLowerCase().includes(q) ?? false)
        );
      });
    }

    return results;
  }

  addImage(image: DesignImage) {
    this.images.push(image);
    return image;
  }

  deleteImage(id: string) {
    this.images = this.images.filter((i) => i.id !== id);
    return { success: true };
  }

  // ── Saves ──

  getSavesByUser(userId: string) {
    return this.saves.filter((s) => s.user_id === userId);
  }

  saveImage(userId: string, imageId: string) {
    const existing = this.saves.find(
      (s) => s.user_id === userId && s.image_id === imageId
    );
    if (existing) return existing;
    const save: Save = {
      id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      user_id: userId,
      image_id: imageId,
      board_id: null,
      created_at: new Date().toISOString(),
    };
    this.saves.push(save);
    return save;
  }

  unsaveImage(userId: string, imageId: string) {
    this.saves = this.saves.filter(
      (s) => !(s.user_id === userId && s.image_id === imageId)
    );
    return { success: true };
  }

  isImageSaved(userId: string, imageId: string) {
    return this.saves.some(
      (s) => s.user_id === userId && s.image_id === imageId
    );
  }

  moveToBoard(saveId: string, boardId: string | null) {
    const idx = this.saves.findIndex((s) => s.id === saveId);
    if (idx === -1) return null;
    this.saves[idx] = { ...this.saves[idx], board_id: boardId };
    return this.saves[idx];
  }

  getSavesByBoard(boardId: string) {
    return this.saves.filter((s) => s.board_id === boardId);
  }

  // ── Boards ──

  getBoardsByUser(userId: string) {
    return this.boards.filter((b) => b.user_id === userId);
  }

  getBoardById(id: string) {
    return this.boards.find((b) => b.id === id) ?? null;
  }

  createBoard(userId: string, name: string) {
    const userBoards = this.boards.filter((b) => b.user_id === userId);
    if (userBoards.length >= 12) {
      throw new Error("Maximum 12 boards allowed");
    }
    const board: Board = {
      id: `b_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      user_id: userId,
      name,
      created_at: new Date().toISOString(),
    };
    this.boards.push(board);
    return board;
  }

  renameBoard(boardId: string, name: string) {
    const idx = this.boards.findIndex((b) => b.id === boardId);
    if (idx === -1) return null;
    this.boards[idx] = { ...this.boards[idx], name };
    return this.boards[idx];
  }

  deleteBoard(boardId: string) {
    this.boards = this.boards.filter((b) => b.id !== boardId);
    this.saves = this.saves.map((s) =>
      s.board_id === boardId ? { ...s, board_id: null } : s
    );
    return { success: true };
  }

  // ── Inquiries ──

  getInquiries() {
    return this.inquiries;
  }

  getInquiriesByDesigner(designerId: string) {
    return this.inquiries.filter((i) => i.designer_id === designerId);
  }

  getInquiriesByUser(userId: string) {
    return this.inquiries.filter((i) => i.user_id === userId);
  }

  createInquiry(data: Omit<Inquiry, "id" | "created_at">) {
    const inquiry: Inquiry = {
      ...data,
      id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.inquiries.push(inquiry);
    return inquiry;
  }

  // ── Users ──

  getUser(id: string) {
    return this.users.find((u) => u.id === id) ?? null;
  }

  getUserByEmail(email: string) {
    return this.users.find((u) => u.email === email) ?? null;
  }

  upsertUser(data: { email: string; name: string }) {
    const existing = this.users.find((u) => u.email === data.email);
    if (existing) {
      existing.name = data.name;
      return existing;
    }
    const newUser: UserRecord = {
      id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      email: data.email,
      name: data.name,
      role: "homeowner",
      created_at: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  getAllUsers() {
    return this.users;
  }

  getTotalSaves() {
    return this.saves.length;
  }

  getTotalBoards() {
    return this.boards.length;
  }

  // ── Admin ──

  resetToDefaults() {
    this.designers = [...mockDesigners];
    this.projects = [...mockProjects];
    this.images = [...mockImages];
    this.saves = [];
    this.boards = [];
    this.inquiries = [];
    return { success: true };
  }
}

export const storage = new InMemoryStorage();
