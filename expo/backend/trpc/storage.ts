import { createClient } from "@supabase/supabase-js";
import { Designer, Project, DesignImage, Board, Save, Inquiry } from "@/types";

const SUPABASE_URL = "https://tcdzizyejbsohcyjozjm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZHppenllamJzb2hjeWpvemptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjQzNzAsImV4cCI6MjA5MDE0MDM3MH0.SsLggeYvv3-gvAMv_f1wUIW2Yb3Id0-gZPYIORtHl3M";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: "homeowner" | "admin";
  created_at: string;
}

class SupabaseStorage {
  async getDesigners(): Promise<Designer[]> {
    const { data, error } = await supabase
      .from("designers")
      .select("*")
      .order("featured", { ascending: false })
      .order("studio_name");
    if (error) throw error;
    return data ?? [];
  }

  async getDesignerById(id: string): Promise<Designer | null> {
    const { data, error } = await supabase.from("designers").select("*").eq("id", id).single();
    if (error) return null;
    return data;
  }

  async searchDesigners(query: string): Promise<Designer[]> {
    const { data, error } = await supabase
      .from("designers")
      .select("*")
      .or(`studio_name.ilike.%${query}%,bio.ilike.%${query}%,city.ilike.%${query}%`);
    if (error) throw error;
    return data ?? [];
  }

  async addDesigner(designer: Designer): Promise<Designer> {
    const { data, error } = await supabase.from("designers").insert(designer).select().single();
    if (error) throw error;
    return data;
  }

  async updateDesigner(id: string, updates: Partial<Designer>): Promise<Designer | null> {
    const { data, error } = await supabase.from("designers").update(updates).eq("id", id).select().single();
    if (error) return null;
    return data;
  }

  async deleteDesigner(id: string): Promise<{ success: boolean }> {
    const { error } = await supabase.from("designers").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  }

  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) throw error;
    return data ?? [];
  }

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
    if (error) return null;
    return data;
  }

  async getProjectsByDesigner(designerId: string): Promise<Project[]> {
    const { data, error } = await supabase.from("projects").select("*").eq("designer_id", designerId);
    if (error) throw error;
    return data ?? [];
  }

  async addProject(project: Project): Promise<Project> {
    const { data, error } = await supabase.from("projects").insert(project).select().single();
    if (error) throw error;
    return data;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single();
    if (error) return null;
    return data;
  }

  async deleteProject(id: string): Promise<{ success: boolean }> {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  }

  async getImages(): Promise<DesignImage[]> {
    const { data, error } = await supabase.from("design_images").select("*").order("sort_priority");
    if (error) throw error;
    return data ?? [];
  }

  async getImageById(id: string): Promise<DesignImage | null> {
    const { data, error } = await supabase.from("design_images").select("*").eq("id", id).single();
    if (error) return null;
    return data;
  }

  async getImagesByProject(projectId: string): Promise<DesignImage[]> {
    const { data, error } = await supabase
      .from("design_images")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_priority");
    if (error) throw error;
    return data ?? [];
  }

  async getImagesByDesigner(designerId: string): Promise<DesignImage[]> {
    const projectIds = (await this.getProjectsByDesigner(designerId)).map((p) => p.id);
    if (!projectIds.length) return [];
    const { data, error } = await supabase
      .from("design_images")
      .select("*")
      .in("project_id", projectIds)
      .order("sort_priority");
    if (error) throw error;
    return data ?? [];
  }

  async searchImages(filters: {
    query?: string;
    roomType?: string;
    designStyle?: string;
    projectType?: string;
    designerId?: string;
  }): Promise<DesignImage[]> {
    let q = supabase.from("design_images").select("*, projects!inner(designer_id, project_type, project_name)");
    if (filters.designerId) q = q.eq("projects.designer_id", filters.designerId);
    if (filters.roomType) q = q.eq("room_type", filters.roomType);
    if (filters.designStyle) q = q.contains("style_tags", [filters.designStyle]);
    if (filters.projectType) q = q.eq("projects.project_type", filters.projectType);
    const { data, error } = await q.order("sort_priority");
    if (error) throw error;
    return data ?? [];
  }

  async addImage(image: DesignImage): Promise<DesignImage> {
    const { data, error } = await supabase.from("design_images").insert(image).select().single();
    if (error) throw error;
    return data;
  }

  async deleteImage(id: string): Promise<{ success: boolean }> {
    const { error } = await supabase.from("design_images").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  }

  async getSavesByUser(userId: string): Promise<Save[]> {
    const { data, error } = await supabase.from("saves").select("*").eq("user_id", userId);
    if (error) throw error;
    return data ?? [];
  }

  async saveImage(userId: string, imageId: string): Promise<Save> {
    const id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await supabase
      .from("saves")
      .upsert({ id, user_id: userId, image_id: imageId, board_id: null })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async unsaveImage(userId: string, imageId: string): Promise<{ success: boolean }> {
    const { error } = await supabase.from("saves").delete().eq("user_id", userId).eq("image_id", imageId);
    if (error) throw error;
    return { success: true };
  }

  async isImageSaved(userId: string, imageId: string): Promise<boolean> {
    const { data } = await supabase.from("saves").select("id").eq("user_id", userId).eq("image_id", imageId).single();
    return !!data;
  }

  async moveToBoard(saveId: string, boardId: string | null): Promise<Save | null> {
    const { data, error } = await supabase.from("saves").update({ board_id: boardId }).eq("id", saveId).select().single();
    if (error) return null;
    return data;
  }

  async getSavesByBoard(boardId: string): Promise<Save[]> {
    const { data, error } = await supabase.from("saves").select("*").eq("board_id", boardId);
    if (error) throw error;
    return data ?? [];
  }

  async getBoardsByUser(userId: string): Promise<Board[]> {
    const { data, error } = await supabase.from("boards").select("*").eq("user_id", userId);
    if (error) throw error;
    return data ?? [];
  }

  async getBoardById(id: string): Promise<Board | null> {
    const { data, error } = await supabase.from("boards").select("*").eq("id", id).single();
    if (error) return null;
    return data;
  }

  async createBoard(userId: string, name: string): Promise<Board> {
    const { count } = await supabase.from("boards").select("id", { count: "exact" }).eq("user_id", userId);
    if ((count ?? 0) >= 12) throw new Error("Maximum 12 boards allowed");
    const id = `b_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await supabase.from("boards").insert({ id, user_id: userId, name }).select().single();
    if (error) throw error;
    return data;
  }

  async renameBoard(boardId: string, name: string): Promise<Board | null> {
    const { data, error } = await supabase.from("boards").update({ name }).eq("id", boardId).select().single();
    if (error) return null;
    return data;
  }

  async deleteBoard(boardId: string): Promise<{ success: boolean }> {
    const { error } = await supabase.from("boards").delete().eq("id", boardId);
    if (error) throw error;
    return { success: true };
  }

  async getInquiries(): Promise<Inquiry[]> {
    const { data, error } = await supabase.from("inquiries").select("*");
    if (error) throw error;
    return data ?? [];
  }

  async getInquiriesByDesigner(designerId: string): Promise<Inquiry[]> {
    const { data, error } = await supabase.from("inquiries").select("*").eq("designer_id", designerId);
    if (error) throw error;
    return data ?? [];
  }

  async getInquiriesByUser(userId: string): Promise<Inquiry[]> {
    const { data, error } = await supabase.from("inquiries").select("*").eq("user_id", userId);
    if (error) throw error;
    return data ?? [];
  }

  async createInquiry(data: Omit<Inquiry, "id" | "created_at">): Promise<Inquiry> {
    const id = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const { data: result, error } = await supabase.from("inquiries").insert({ ...data, id }).select().single();
    if (error) throw error;
    return result;
  }

  async getUser(id: string): Promise<UserRecord | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
    if (error) return null;
    return data;
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single();
    if (error) return null;
    return data;
  }

  async upsertUser(data: { email: string; name: string }): Promise<UserRecord> {
    const existing = await this.getUserByEmail(data.email);
    if (existing) {
      const { data: updated } = await supabase.from("users").update({ name: data.name }).eq("email", data.email).select().single();
      return updated;
    }
    const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const { data: newUser, error } = await supabase.from("users").insert({ id, ...data, role: "homeowner" }).select().single();
    if (error) throw error;
    return newUser;
  }

  async getAllUsers(): Promise<UserRecord[]> {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data ?? [];
  }

  async getTotalSaves(): Promise<number> {
    const { count } = await supabase.from("saves").select("id", { count: "exact" });
    return count ?? 0;
  }

  async getTotalBoards(): Promise<number> {
    const { count } = await supabase.from("boards").select("id", { count: "exact" });
    return count ?? 0;
  }

  async resetToDefaults(): Promise<{ success: boolean }> {
    throw new Error("Reset not available in production mode");
  }
}

export const storage = new SupabaseStorage();
