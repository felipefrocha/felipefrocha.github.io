import { useQuery } from '@tanstack/react-query';
import { fetchSiteData, fetchAllPosts, fetchPost, fetchProjects } from '@/lib/api';
import { useTranslation } from 'react-i18next';

// Auto-refresh in development mode
const isDevelopment = import.meta.env.DEV;

export function useSiteData() {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ['/api/site-data', i18n.language],
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });
}

export function useAllPosts() {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ['/api/posts', i18n.language],
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });
}

export function usePost(slug: string) {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ['/api/posts', slug, i18n.language],
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
