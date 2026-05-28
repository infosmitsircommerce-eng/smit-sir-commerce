import { Helmet } from 'react-helmet-async';

const BASE = 'https://smitsircommerce.vercel.app';
const DEFAULT_IMG = `${BASE}/og-image.jpg`;
const SITE = 'Smit Sir Commerce';

export default function SEO({ title, description, path = '', image = DEFAULT_IMG }) {
  const fullTitle = title ? `${title} | ${SITE}` : `${SITE} | Class 11 & 12 CBSE Commerce Coaching Mehsana`;
  const url = `${BASE}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'Expert CBSE Commerce coaching for Class 11 & 12 in Mehsana, Gujarat. Economics, Accountancy, Business Studies — notes, quizzes, test series & free demo.'} />
      <link rel="canonical" href={url} />
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || 'Expert CBSE Commerce coaching in Mehsana, Gujarat.'} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || 'Expert CBSE Commerce coaching in Mehsana, Gujarat.'} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
