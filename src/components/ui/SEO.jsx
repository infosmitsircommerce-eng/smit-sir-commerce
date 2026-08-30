import { Helmet } from 'react-helmet-async';
const BASE = 'https://www.smitsircommerce.in';
const DEFAULT_IMG = BASE + '/og-image.jpg';
const SITE = 'Smit Sir Commerce';
const DEFAULT_DESCRIPTION = 'CBSE Commerce coaching for Class 11 and 12 in Mehsana, Gujarat, with chapter-wise notes, practice resources, online and offline batches, and a free demo class.';

export default function SEO({ title, description = DEFAULT_DESCRIPTION, path = '', image = DEFAULT_IMG, noindex = false }) {
  const fullTitle = title ? title + ' | ' + SITE : SITE + ' | Class 11 & 12 CBSE Commerce Coaching Mehsana';
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
  const url = BASE + normalizedPath;
  return (
    <Helmet>
      <title>{fullTitle}</title><meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" /><meta property="og:site_name" content={SITE} /><meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={fullTitle} /><meta property="og:description" content={description} /><meta property="og:url" content={url} /><meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={fullTitle} /><meta name="twitter:description" content={description} /><meta name="twitter:image" content={image} />
    </Helmet>
  );
}
