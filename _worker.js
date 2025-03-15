export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      
      // Example of custom handling
      if (url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ message: "This is an API response" }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      
      // Let Cloudflare Pages handle serving static assets
      return env.ASSETS.fetch(request);
    }
  };