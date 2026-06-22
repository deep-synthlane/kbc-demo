import server from './dist/server/server.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Serve static assets directly via Cloudflare Pages ASSETS binding
    if (env.ASSETS) {
      const isAsset =
        url.pathname.startsWith('/assets/') ||
        url.pathname.startsWith('/kcg-logo') ||
        url.pathname.match(/\.(css|js|png|jpg|svg|ico|woff2?|ttf|map)$/);

      if (isAsset) {
        const assetRes = await env.ASSETS.fetch(request.clone()).catch(() => null);
        if (assetRes && assetRes.status !== 404) return assetRes;
      }
    }

    // Fall back to SSR for all app routes
    return server.fetch(request, env, ctx);
  },
};
