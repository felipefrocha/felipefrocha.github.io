import { useQuery } from '@tanstack/react-query';
import { fetchSiteData, fetchAllPosts, fetchPost, fetchProjects } from '@/lib/api';

// Auto-refresh in development mode
const isDevelopment = import.meta.env.DEV;

export function useSiteData() {
  return useQuery({
    queryKey: ['/api/site-data'],
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });
}

export function useAllPosts() {
  return useQuery({
    queryKey: ['/api/posts'],
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['/api/posts', slug],
    enabled: !!slug,
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ['/api/projects'],
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });
}
