import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { Designer, Project, DesignImage } from '@/types';
import { trpc } from '@/lib/trpc';
import {
  designers as mockDesigners,
  projects as mockProjects,
  images as mockImages,
} from '@/mocks/data';

export const [DataProvider, useData] = createContextHook(() => {
  const queryClient = useQueryClient();

  const designersQuery = trpc.designers.list.useQuery(undefined, {
    initialData: mockDesigners,
  });
  const projectsQuery = trpc.projects.list.useQuery(undefined, {
    initialData: mockProjects,
  });
  const imagesQuery = trpc.images.list.useQuery(undefined, {
    initialData: mockImages,
  });

  const designers = designersQuery.data ?? mockDesigners;
  const projects = projectsQuery.data ?? mockProjects;
  const images = imagesQuery.data ?? mockImages;

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [['designers']] });
    queryClient.invalidateQueries({ queryKey: [['projects']] });
    queryClient.invalidateQueries({ queryKey: [['images']] });
  }, [queryClient]);

  const addDesignerMutation = trpc.designers.add.useMutation({
    onSuccess: () => invalidateAll(),
  });

  const deleteDesignerMutation = trpc.designers.delete.useMutation({
    onSuccess: () => invalidateAll(),
  });

  const addProjectMutation = trpc.projects.add.useMutation({
    onSuccess: () => invalidateAll(),
  });

  const deleteProjectMutation = trpc.projects.delete.useMutation({
    onSuccess: () => invalidateAll(),
  });

  const addImageMutation = trpc.images.add.useMutation({
    onSuccess: () => invalidateAll(),
  });

  const deleteImageMutation = trpc.images.delete.useMutation({
    onSuccess: () => invalidateAll(),
  });

  const resetMutation = trpc.admin.reset.useMutation({
    onSuccess: () => invalidateAll(),
  });

  const addDesigner = useCallback((data: Omit<Designer, 'id'> & { id?: string }) => {
    addDesignerMutation.mutate({
      studio_name: data.studio_name,
      bio: data.bio,
      city: data.city,
      website_url: data.website_url,
      instagram_url: data.instagram_url,
      featured: data.featured,
      avatar_url: data.avatar_url,
    });
  }, [addDesignerMutation]);

  const deleteDesigner = useCallback((id: string) => {
    deleteDesignerMutation.mutate({ id });
  }, [deleteDesignerMutation]);

  const addProject = useCallback((data: Omit<Project, 'id'> & { id?: string }) => {
    addProjectMutation.mutate({
      designer_id: data.designer_id,
      project_name: data.project_name,
      project_type: data.project_type,
      city: data.city,
    });
  }, [addProjectMutation]);

  const deleteProject = useCallback((id: string) => {
    deleteProjectMutation.mutate({ id });
  }, [deleteProjectMutation]);

  const addImage = useCallback((data: Omit<DesignImage, 'id'> & { id?: string }) => {
    addImageMutation.mutate({
      project_id: data.project_id,
      image_url: data.image_url,
      room_type: data.room_type,
      style_tags: data.style_tags,
      sort_priority: data.sort_priority,
      aspect_ratio: data.aspect_ratio,
    });
  }, [addImageMutation]);

  const deleteImage = useCallback((id: string) => {
    deleteImageMutation.mutate({ id });
  }, [deleteImageMutation]);

  const resetToMocks = useCallback(() => {
    resetMutation.mutate();
  }, [resetMutation]);

  const getDesignerForImage = useCallback((imageId: string): Designer | undefined => {
    const image = images.find(i => i.id === imageId);
    if (!image) return undefined;
    const project = projects.find(p => p.id === image.project_id);
    if (!project) return undefined;
    return designers.find(d => d.id === project.designer_id);
  }, [images, projects, designers]);

  const getProjectForImage = useCallback((imageId: string): Project | undefined => {
    const image = images.find(i => i.id === imageId);
    if (!image) return undefined;
    return projects.find(p => p.id === image.project_id);
  }, [images, projects]);

  const getImagesForDesigner = useCallback((designerId: string): DesignImage[] => {
    const designerProjects = projects.filter(p => p.designer_id === designerId);
    const projectIds = designerProjects.map(p => p.id);
    return images.filter(i => projectIds.includes(i.project_id));
  }, [projects, images]);

  const getSortedImages = useCallback((): DesignImage[] => {
    const featured = designers.filter(d => d.featured).map(d => d.id);
    return [...images].sort((a, b) => {
      const projA = projects.find(p => p.id === a.project_id);
      const projB = projects.find(p => p.id === b.project_id);
      const aFeatured = projA && featured.includes(projA.designer_id) ? 0 : 1;
      const bFeatured = projB && featured.includes(projB.designer_id) ? 0 : 1;
      if (aFeatured !== bFeatured) return aFeatured - bFeatured;
      return a.sort_priority - b.sort_priority;
    });
  }, [designers, projects, images]);

  return {
    designers,
    projects,
    images,
    isLoading: designersQuery.isLoading || projectsQuery.isLoading || imagesQuery.isLoading,
    addDesigner,
    deleteDesigner,
    addProject,
    deleteProject,
    addImage,
    deleteImage,
    resetToMocks,
    getDesignerForImage,
    getProjectForImage,
    getImagesForDesigner,
    getSortedImages,
  };
});
