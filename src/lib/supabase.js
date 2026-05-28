import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://abpruwygnsmeqisaehip.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9eybAsihq3-YNL1uGmGo3w_DWheWwRg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
