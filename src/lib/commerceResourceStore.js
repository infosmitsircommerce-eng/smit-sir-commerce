import { supabase } from './supabase';
import { normalizeCommerceResource } from './commerceResourceModel';

export async function getPublishedCommerceResources(filters = {}) {
  let query = supabase
    .from('content_items')
    .select('slug,status,payload,updated_at')
    .eq('type', 'resource')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  if (filters.slug) query = query.eq('slug', filters.slug);

  const { data, error } = await query;
  if (error) throw error;

  let resources = (data || []).map(normalizeCommerceResource);
  if (filters.stage) resources = resources.filter((item) => item.stage === filters.stage);
  if (filters.degree) resources = resources.filter((item) => item.degree === filters.degree);
  if (filters.exam) resources = resources.filter((item) => item.exam === filters.exam);
  if (filters.university) resources = resources.filter((item) => item.university === filters.university);
  if (filters.semester) resources = resources.filter((item) => Number(item.semester) === Number(filters.semester));
  if (filters.unit) resources = resources.filter((item) => Number(item.unit) === Number(filters.unit));
  return resources;
}

export async function getPublishedCommerceResource(slug) {
  const resources = await getPublishedCommerceResources({ slug });
  return resources[0] || null;
}

export function publicCommerceFileUrl(storagePath) {
  if (!storagePath) return '';
  const { data } = supabase.storage.from('commerce-materials').getPublicUrl(storagePath);
  return data?.publicUrl || '';
}
