const LEGACY_COMMERCE_REDIRECTS = new Map<string, string>([
  ['/ugc-net-commerce', '/ugc-net-commerce-notes'],
  ['/gset-commerce', '/gset-commerce-code-17-notes'],
]);

export const config = {
  matcher: ['/ugc-net-commerce', '/gset-commerce'],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const destination = LEGACY_COMMERCE_REDIRECTS.get(url.pathname);

  if (!destination) {
    return new Response(null, { status: 404 });
  }

  const redirectUrl = new URL(destination, request.url);
  redirectUrl.search = url.search;

  return new Response(null, {
    status: 308,
    headers: {
      Location: redirectUrl.toString(),
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  });
}