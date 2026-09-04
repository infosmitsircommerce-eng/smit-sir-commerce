import { Helmet } from 'react-helmet-async';
import { hubByPath, materialByPath } from '../../data/seoMaterials';

const BASE = 'https://www.smitsircommerce.in';
const DEFAULT_IMG = BASE + '/og-image.jpg';
const SITE = 'Smit Sir Commerce';
const DEFAULT_DESCRIPTION = 'A growing Commerce learning platform with Class 11 & 12, B.Com, M.Com, UGC NET and GSET resources, plus specialist Class 11 & 12 teaching by Smit Sir.';

const SITEWIDE_ENTITY = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: `${BASE}/`,
      name: SITE,
      inLanguage: 'en-IN',
      publisher: { '@id': `${BASE}/#organization` },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': `${BASE}/#organization`,
      name: SITE,
      alternateName: 'Smit Sir Commerce Classes',
      url: `${BASE}/`,
      email: 'infosmitsircommerce@gmail.com',
      description: 'A Commerce learning platform spanning school, college and competitive-exam resources, with specialist Class 11 and 12 teaching by Smit Sir and a growing library for B.Com, M.Com, UGC NET Commerce and GSET Commerce.',
      areaServed: {
        '@type': 'City',
        name: 'Mehsana',
        containedInPlace: {
          '@type': 'State',
          name: 'Gujarat',
          containedInPlace: { '@type': 'Country', name: 'India' },
        },
      },
      knowsAbout: [
        'Class 11 Commerce',
        'Class 12 Commerce',
        'CBSE Commerce',
        'Economics',
        'Business Studies',
        'Accountancy learning resources',
        'Entrepreneurship',
        'Physical Education',
        'Commerce exam preparation',
        'B.Com learning resources',
        'M.Com learning resources',
        'UGC NET Commerce preparation resources',
        'GSET Commerce preparation resources',
      ],
      founder: {
        '@type': 'Person',
        '@id': `${BASE}/about#smit-thaker`,
        name: 'Smit Thaker',
        url: `${BASE}/about`,
        worksFor: { '@id': `${BASE}/#organization` },
        knowsAbout: ['Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education', 'Commerce education'],
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Class 11 and 12 tuition and academic support in Mehsana',
        itemListElement: [
          'Class 11 Commerce Tuition',
          'Class 12 Commerce Tuition',
          'Economics Tuition',
          'Business Studies Tuition',
          'Entrepreneurship Tuition',
          'Physical Education Tuition',
          'Free Test-Paper Analysis',
          'Free Demo Class',
        ].map((name) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name,
            areaServed: { '@type': 'City', name: 'Mehsana' },
            provider: { '@id': `${BASE}/#organization` },
          },
        })),
      },
    },
    {
      '@type': 'Person',
      '@id': `${BASE}/about#smit-thaker`,
      name: 'Smit Thaker',
      url: `${BASE}/about`,
      worksFor: { '@id': `${BASE}/#organization` },
      knowsAbout: ['Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education', 'Commerce education'],
    },
  ],
};

function getChapterSearchMeta(path) {
  const material = materialByPath[path];
  if (!material) return null;

  if (path === '/cbse/class-12/business-studies/controlling-notes') {
    return {
      title: 'Controlling Class 12 Notes PDF | Business Studies Chapter 8',
      description: 'Free CBSE Class 12 Business Studies Controlling notes PDF for Chapter 8. Revise meaning, importance, planning-controlling relationship, control process, management by exception and corrective action.',
    };
  }

  if (path === '/cbse/class-11/microeconomics/economics-and-economy-notes') {
    return {
      title: 'Economics and Economy Class 11 Notes PDF | Microeconomics Chapter 1',
      description: 'Free CBSE Class 11 Economics and Economy notes PDF for Microeconomics Chapter 1. Revise scarcity, choice, opportunity cost, economic activities, micro vs macro and types of economies.',
    };
  }

  const hub = hubByPath[material.hub_path];
  const subject = hub?.label?.replace(`Class ${material.class_level} `, '') || material.subject;
  return {
    title: `Free CBSE Class ${material.class_level} ${subject} Chapter ${material.chapterNumber} ${material.chapter} Notes PDF`,
    description: `Free CBSE Class ${material.class_level} ${subject} Chapter ${material.chapterNumber} ${material.chapter} notes PDF. View online or download chapter-wise notes with key topics, important questions, MCQs and exam-focused revision.`,
  };
}

function getLocalSearchMeta(path) {
  if (path !== '/commerce-coaching-mehsana') return null;
  return {
    title: 'Commerce Tuition in Mehsana — Class 11 & 12 CBSE',
    description: 'Commerce tuition in Mehsana for CBSE Class 11 and 12 with Economics, Business Studies and Entrepreneurship teaching, tests, revision resources and demo-class booking by Smit Sir Commerce.',
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
  const localMeta = getLocalSearchMeta(normalizedPath);
  const searchMeta = chapterMeta || localMeta;
  const effectiveTitle = searchMeta?.title || title;
  const effectiveDescription = searchMeta?.description || description;
  const fullTitle = effectiveTitle ? `${effectiveTitle} | ${SITE}` : `${SITE} | Commerce Learning Hub`;
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

      <script type="application/ld+json">{JSON.stringify(SITEWIDE_ENTITY)}</script>
      {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
    </Helmet>
  );
}
