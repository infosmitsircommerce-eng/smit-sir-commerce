import { createClient } from '@supabase/supabase-js';
import { normalizeCommerceResource } from '../src/lib/commerceResourceModel.js';

const SUPABASE_URL = 'https://abpruwygnsmeqisaehip.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_9eybAsihq3-YNL1uGmGo3w_DWheWwRg';

const client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function fetchPublishedCommerceResources() {
  try {
    const { data, error } = await client
      .from('content_items')
      .select('slug,status,payload,updated_at')
      .eq('type', 'resource')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(normalizeCommerceResource);
  } catch (error) {
    console.warn('[commerce-resources] Could not read published resources during build:', error?.message || error);
    return [];
  }
}

export function publishedDegreeState(resources) {
  return {
    bcom: resources.some((item) => item.stage === 'college' && item.degree === 'B.Com'),
    mcom: resources.some((item) => item.stage === 'college' && item.degree === 'M.Com'),
  };
}
