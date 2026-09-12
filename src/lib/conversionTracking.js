import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseConfig.js';

const names = new Set(['premium_qr_open', 'premium_qr_download', 'pdf_download_click', 'premium_reference_submitted']);
const fields = new Set(['resource', 'board', 'chapter', 'access', 'surface', 'offer']);

// No account IDs, payment references, search queries or revenue in browser events.
export function conversionPayload(name, metadata = {}, path = '/') {
  if (!names.has(name)) return null;
  const clean = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (fields.has(key) && typeof value === 'string') clean[key] = value.slice(0, 160);
    else if (fields.has(key) && typeof value === 'number' && Number.isFinite(value)) clean[key] = value;
  }
  return { user_id: null, event_name: name, path: path.split(/[?#]/)[0].slice(0, 240), metadata: clean };
}

export async function trackConversion(name, metadata = {}) {
  const event = conversionPayload(name, metadata, window.location.pathname);
  if (!event) return false;
  try { window.gtag?.('event', name, { ...event.metadata, page_path: event.path }); } catch { /* Analytics must not block learning. */ }
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/learning_events`, {
      method: 'POST', keepalive: true,
      headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(event),
    });
    return response.ok;
  } catch { return false; }
}

export function downloadEvent(anchor, origin) {
  if (!anchor) return null;
  const resource = anchor.dataset?.pdfResource;
  if (resource) return ['pdf_download_click', { resource, access: 'premium' }];
  try {
    const url = new URL(anchor.getAttribute('href'), origin);
    if (url.origin !== origin) return null;
    if (url.pathname === '/premium-payment-qr.jpg' && anchor.hasAttribute('download')) {
      return ['premium_qr_download', { offer: 'lifetime-999' }];
    }
    if (/\.pdf$/i.test(url.pathname)) return ['pdf_download_click', { resource: url.pathname, access: 'free' }];
  } catch { /* Ignore malformed or external URLs. */ }
  return null;
}

export function installDownloadTracking() {
  const handle = event => {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const tracking = downloadEvent(event.target?.closest?.('a[href]'), window.location.origin);
    if (tracking) void trackConversion(...tracking);
  };
  document.addEventListener('click', handle, true);
  document.addEventListener('auxclick', handle, true);
  return () => { document.removeEventListener('click', handle, true); document.removeEventListener('auxclick', handle, true); };
}
