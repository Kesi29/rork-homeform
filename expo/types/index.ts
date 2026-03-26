export type RoomType =
  | 'Kitchen'
  | 'Living Room'
  | 'Dining Room'
  | 'Bedroom'
  | 'Bathroom'
  | 'Office / Study'
  | 'Entryway'
  | 'Outdoor'
  | 'Whole Home';

export type DesignStyle =
  | 'Modern'
  | 'Transitional'
  | 'Traditional'
  | 'Warm Minimal'
  | 'Contemporary'
  | 'Eclectic'
  | 'Organic / Natural'
  | 'Luxury';

export type ProjectType =
  | 'Apartment'
  | 'Condo'
  | 'Single-Family Home'
  | 'Renovation'
  | 'New Build';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'homeowner' | 'admin';
  created_at: string;
}

export interface Designer {
  id: string;
  studio_name: string;
  bio: string;
  city: string;
  website_url: string;
  instagram_url: string;
  featured: boolean;
  avatar_url: string;
}

export interface Project {
  id: string;
  designer_id: string;
  project_name: string;
  project_type: ProjectType;
  city: string;
}

export interface DesignImage {
  id: string;
  project_id: string;
  image_url: string;
  room_type: RoomType;
  style_tags: [DesignStyle] | [DesignStyle, DesignStyle];
  sort_priority: number;
  aspect_ratio: number;
}

export interface Board {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Save {
  id: string;
  user_id: string;
  image_id: string;
  board_id: string | null;
  created_at: string;
}

export interface Inquiry {
  id: string;
  user_id: string;
  designer_id: string;
  name: string;
  email: string;
  zip_code: string;
  message: string;
  created_at: string;
}

export type Location = 'Chicago' | 'All';

export interface Filters {
  roomType: RoomType | null;
  designStyle: DesignStyle | null;
  projectType: ProjectType | null;
  location: Location | null;
}
