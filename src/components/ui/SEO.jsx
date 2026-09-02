import { Helmet } from 'react-helmet-async';
import { hubByPath, materialByPath } from '../../data/seoMaterials';

const BASE = 'https://www.smitsircommerce.in';
const DEFAULT_IMG = BASE + '/og-image.jpg';
const SITE = 'Smit Sir Commerce';
const DEFAULT_DESCRIPTION = 'CBSE Commerce coaching for Class 11 and 12 in Mehsana, Gujarat, with chapter-wise notes, practice resources, online and offline batches, and a free demo class.';

function getChapterSearchMeta(path) {
  const material = materialByPath[path];
  if (!material) return null;
  const hub = hubByPath[material.hub_path];
  const subject = hub?.label?.replace(`Class ${material.class_level} `, '') || material.subject;
  return {
    title: `Free CBSE Class ${material.class_level} ${subject} Chapter ${material.chapterNumber} ${material.chapter} Notes PDF`,
    description: `Free CBSE Class ${material.class_level} ${subject} Chapter ${material.chapterNumber} ${material.chapter} notes PDF. View online or download chapter-wise notes with key topics, important questions, MCQs and exam-focused revision.`,
  };
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMG,
  noindex = false,
  type = 'website',
  structuredData = null,
  publishedTime = null,
  modifiedTime = null,
}) {
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
  const chapterMeta = getChapterSearchMeta(normalizedPath);
  const effectiveTitle = chapterMeta?.title || title;
  const effectiveDescription = chapterMeta?.description || description;
  const fullTitle = effectiveTitle ? `${effectiveTitle} | ${SITE}` : `${SITE} | Free CBSE Commerce Notes Class 11 & 12`;
  const url = BASE + normalizedPath;
  const robots = noindex
    ? 'noindex, nofollow, nosnippet'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={effectiveDescription} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="bingbot" content={robots} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={effectiveDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${effectiveTitle || SITE} — ${SITE}`} />

      {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={effectiveDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${effectiveTitle || SITE} — ${SITE}`} />

      {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
    </Helmet>
  );
}
