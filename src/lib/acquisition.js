const KEY = 'ssc-acquisition-v1';
const SOURCES = ['Google', 'Instagram', 'WhatsApp', 'Referral', 'Direct', 'Other'];

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
function write(value) {
  try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* ignore */ }
}
function clean(value, max = 160) {
  return value ? String(value).trim().slice(0, max) : null;
}
function classify(search = '') {
  const params = new URLSearchParams(search);
  const explicit = params.get('source');
  const utmSource = (params.get('utm_source') || '').toLowerCase();
  let ref = '';
  try { ref = new URL(document.referrer).hostname.toLowerCase(); } catch { ref = ''; }
  const combined = `${explicit || ''} ${utmSource} ${ref}`.toLowerCase();
  if (combined.includes('google')) return 'Google';
  if (combined.includes('instagram') || combined.includes('l.instagram') || combined.includes('ig')) return 'Instagram';
  if (combined.includes('whatsapp') || combined.includes('wa.me')) return 'WhatsApp';
  if (combined.includes('referral') || combined.includes('refer')) return 'Referral';
  if (explicit && SOURCES.includes(explicit)) return explicit;
  return 'Direct';
}

export function captureAcquisition(pathname = '/', search = '') {
  const params = new URLSearchParams(search);
  const source = classify(search);
  const explicitSignal = Boolean(params.get('source') || params.get('utm_source') || params.get('utm_medium') || params.get('utm_campaign'));
  const previous = read();
  const touch = {
    source,
    utmSource: clean(params.get('utm_source'), 120),
    utmMedium: clean(params.get('utm_medium'), 120),
    utmCampaign: clean(params.get('utm_campaign'), 160),
    path: clean(pathname, 240),
    at: new Date().toISOString(),
  };

  if (!previous) {
    const created = { first: touch, last: touch };
    write(created);
    return created;
  }
  if (explicitSignal && source !== 'Direct') {
    const updated = { ...previous, last: touch };
    write(updated);
    return updated;
  }
  return previous;
}

export function getAcquisition() {
  return read();
}
