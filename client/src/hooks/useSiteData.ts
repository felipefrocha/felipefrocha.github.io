import { useQuery } from '@tanstack/react-query';
import { fetchSiteData, fetchAllPosts, fetchPost, fetchProjects } from '@/lib/api';

export function useSiteData() {
  return useQuery({
    queryKey: ['/api/site-data'],
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllPosts() {
  return useQuery({
    queryKey: ['/api/posts'],
    staleTime: 5 * 60 * 1000,
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['/api/posts', slug],
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ['/api/projects'],
    staleTime: 5 * 60 * 1000,
  });
}
