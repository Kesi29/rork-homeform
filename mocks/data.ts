import { Designer, Project, DesignImage } from '@/types';

export const designers: Designer[] = [
  {
    id: 'd1',
    studio_name: 'Atelier Noir',
    bio: 'A Chicago-based interior design studio specializing in warm minimalism and thoughtful material palettes for modern living.',
    city: 'Chicago',
    website_url: 'https://ateliernoir.com',
    instagram_url: 'https://instagram.com/ateliernoir',
    featured: true,
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'd2',
    studio_name: 'Studio Luma',
    bio: 'Blending contemporary design with organic textures. We create spaces that feel both elevated and deeply livable.',
    city: 'Chicago',
    website_url: 'https://studioluma.com',
    instagram_url: 'https://instagram.com/studioluma',
    featured: true,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'd3',
    studio_name: 'Harlow & Pine',
    bio: 'Traditional meets transitional. We design homes that honor Chicago\'s architectural heritage while embracing modern comfort.',
    city: 'Chicago',
    website_url: 'https://harlowpine.com',
    instagram_url: 'https://instagram.com/harlowpine',
    featured: false,
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'd4',
    studio_name: 'Kova Interiors',
    bio: 'Luxury interiors rooted in restraint. Every detail is intentional, every space tells a story.',
    city: 'Chicago',
    website_url: 'https://kovainteriors.com',
    instagram_url: 'https://instagram.com/kovainteriors',
    featured: true,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'd5',
    studio_name: 'Morrow Collective',
    bio: 'Eclectic, layered, and deeply personal. We design for the way you actually live.',
    city: 'Chicago',
    website_url: 'https://morrowcollective.com',
    instagram_url: 'https://instagram.com/morrowcollective',
    featured: false,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  },
];

export const projects: Project[] = [
  { id: 'p1', designer_id: 'd1', project_name: 'Lincoln Park Residence', project_type: 'Single-Family Home', city: 'Chicago' },
  { id: 'p2', designer_id: 'd1', project_name: 'Wicker Park Loft', project_type: 'Apartment', city: 'Chicago' },
  { id: 'p3', designer_id: 'd2', project_name: 'Gold Coast Penthouse', project_type: 'Condo', city: 'Chicago' },
  { id: 'p4', designer_id: 'd2', project_name: 'Bucktown Brownstone', project_type: 'Renovation', city: 'Chicago' },
  { id: 'p5', designer_id: 'd3', project_name: 'Lakeview Greystone', project_type: 'Renovation', city: 'Chicago' },
  { id: 'p6', designer_id: 'd3', project_name: 'Evanston Colonial', project_type: 'Single-Family Home', city: 'Chicago' },
  { id: 'p7', designer_id: 'd4', project_name: 'River North Tower', project_type: 'New Build', city: 'Chicago' },
  { id: 'p8', designer_id: 'd4', project_name: 'Streeterville Condo', project_type: 'Condo', city: 'Chicago' },
  { id: 'p9', designer_id: 'd5', project_name: 'Logan Square Bungalow', project_type: 'Single-Family Home', city: 'Chicago' },
  { id: 'p10', designer_id: 'd5', project_name: 'Pilsen Artist Studio', project_type: 'Apartment', city: 'Chicago' },
];

export const images: DesignImage[] = [
  {
    id: 'i1', project_id: 'p1', sort_priority: 1, aspect_ratio: 1.35,
    image_url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    room_type: 'Kitchen', style_tags: ['Warm Minimal', 'Modern'],
  },
  {
    id: 'i2', project_id: 'p1', sort_priority: 2, aspect_ratio: 0.72,
    image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    room_type: 'Living Room', style_tags: ['Warm Minimal'],
  },
  {
    id: 'i3', project_id: 'p2', sort_priority: 3, aspect_ratio: 1.25,
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    room_type: 'Bedroom', style_tags: ['Modern', 'Warm Minimal'],
  },
  {
    id: 'i4', project_id: 'p3', sort_priority: 1, aspect_ratio: 0.68,
    image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    room_type: 'Living Room', style_tags: ['Contemporary', 'Luxury'],
  },
  {
    id: 'i5', project_id: 'p3', sort_priority: 2, aspect_ratio: 1.4,
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    room_type: 'Bathroom', style_tags: ['Luxury'],
  },
  {
    id: 'i6', project_id: 'p4', sort_priority: 3, aspect_ratio: 0.75,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    room_type: 'Living Room', style_tags: ['Organic / Natural', 'Contemporary'],
  },
  {
    id: 'i7', project_id: 'p4', sort_priority: 4, aspect_ratio: 1.3,
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    room_type: 'Dining Room', style_tags: ['Organic / Natural'],
  },
  {
    id: 'i8', project_id: 'p5', sort_priority: 2, aspect_ratio: 1.25,
    image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    room_type: 'Kitchen', style_tags: ['Transitional', 'Traditional'],
  },
  {
    id: 'i9', project_id: 'p5', sort_priority: 5, aspect_ratio: 0.7,
    image_url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    room_type: 'Entryway', style_tags: ['Traditional'],
  },
  {
    id: 'i10', project_id: 'p6', sort_priority: 3, aspect_ratio: 1.2,
    image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    room_type: 'Bedroom', style_tags: ['Transitional'],
  },
  {
    id: 'i11', project_id: 'p7', sort_priority: 1, aspect_ratio: 1.35,
    image_url: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80',
    room_type: 'Living Room', style_tags: ['Luxury', 'Modern'],
  },
  {
    id: 'i12', project_id: 'p7', sort_priority: 2, aspect_ratio: 0.65,
    image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    room_type: 'Bathroom', style_tags: ['Luxury', 'Contemporary'],
  },
  {
    id: 'i13', project_id: 'p8', sort_priority: 3, aspect_ratio: 1.22,
    image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    room_type: 'Kitchen', style_tags: ['Modern'],
  },
  {
    id: 'i14', project_id: 'p8', sort_priority: 4, aspect_ratio: 0.72,
    image_url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    room_type: 'Office / Study', style_tags: ['Contemporary', 'Modern'],
  },
  {
    id: 'i15', project_id: 'p9', sort_priority: 2, aspect_ratio: 1.38,
    image_url: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80',
    room_type: 'Dining Room', style_tags: ['Eclectic'],
  },
  {
    id: 'i16', project_id: 'p9', sort_priority: 5, aspect_ratio: 0.78,
    image_url: 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&q=80',
    room_type: 'Living Room', style_tags: ['Eclectic', 'Organic / Natural'],
  },
  {
    id: 'i17', project_id: 'p10', sort_priority: 3, aspect_ratio: 1.28,
    image_url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80',
    room_type: 'Bedroom', style_tags: ['Eclectic', 'Warm Minimal'],
  },
  {
    id: 'i18', project_id: 'p2', sort_priority: 6, aspect_ratio: 1.22,
    image_url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80',
    room_type: 'Kitchen', style_tags: ['Modern', 'Warm Minimal'],
  },
  {
    id: 'i19', project_id: 'p6', sort_priority: 4, aspect_ratio: 0.74,
    image_url: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80',
    room_type: 'Living Room', style_tags: ['Traditional', 'Transitional'],
  },
  {
    id: 'i20', project_id: 'p7', sort_priority: 1, aspect_ratio: 1.18,
    image_url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    room_type: 'Outdoor', style_tags: ['Luxury', 'Contemporary'],
  },
];

export const ROOM_TYPES = [
  'Kitchen', 'Living Room', 'Dining Room', 'Bedroom', 'Bathroom',
  'Office / Study', 'Entryway', 'Outdoor', 'Whole Home',
] as const;

export const DESIGN_STYLES = [
  'Modern', 'Transitional', 'Traditional', 'Warm Minimal',
  'Contemporary', 'Eclectic', 'Organic / Natural', 'Luxury',
] as const;

export const PROJECT_TYPES = [
  'Apartment', 'Condo', 'Single-Family Home', 'Renovation', 'New Build',
] as const;

export const LOCATIONS = [
  'Chicago',
] as const;

export function getDesignerForImage(imageId: string): Designer | undefined {
  const image = images.find(i => i.id === imageId);
  if (!image) return undefined;
  const project = projects.find(p => p.id === image.project_id);
  if (!project) return undefined;
  return designers.find(d => d.id === project.designer_id);
}

export function getProjectForImage(imageId: string): Project | undefined {
  const image = images.find(i => i.id === imageId);
  if (!image) return undefined;
  return projects.find(p => p.id === image.project_id);
}

export function getImagesForDesigner(designerId: string): DesignImage[] {
  const designerProjects = projects.filter(p => p.designer_id === designerId);
  const projectIds = designerProjects.map(p => p.id);
  return images.filter(i => projectIds.includes(i.project_id));
}

export function getSortedImages(): DesignImage[] {
  const featured = designers.filter(d => d.featured).map(d => d.id);
  return [...images].sort((a, b) => {
    const projA = projects.find(p => p.id === a.project_id);
    const projB = projects.find(p => p.id === b.project_id);
    const aFeatured = projA && featured.includes(projA.designer_id) ? 0 : 1;
    const bFeatured = projB && featured.includes(projB.designer_id) ? 0 : 1;
    if (aFeatured !== bFeatured) return aFeatured - bFeatured;
    return a.sort_priority - b.sort_priority;
  });
}
