/**
 * Cloudflare Worker — SPA routing for tarot-draw.app
 *
 * Deploy:
 *   Option A (Dashboard): Cloudflare → Workers & Pages → Create Worker → paste this script
 *                         → Settings → Triggers → Add Route: tarot-draw.app/*
 *   Option B (CLI):       wrangler login && wrangler deploy
 *
 * How it works:
 *   - Static assets (.js, .css, images, fonts…) → pass through to GitHub Pages origin
 *   - All other paths (SPA routes like /draw, /result) → serve root index.html
 *     so React Router can handle the route on the client side
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Static assets — serve directly from origin (GitHub Pages)
    const isAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|map|txt|xml|json)$/i
      .test(url.pathname);

    if (isAsset || url.pathname === '/') {
      return fetch(request);
    }

    // SPA route — fetch root index.html instead
    // Cloudflare guarantees no recursion: subrequests from Workers skip the Worker
    const indexRequest = new Request(`${url.origin}/`, {
      method: 'GET',
      headers: request.headers,
    });
    const response = await fetch(indexRequest);

    // Return with original URL preserved (don't redirect, just serve content)
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  },
};
