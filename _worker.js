// This is our new "traffic controller" that runs on Cloudflare's servers.
export default {
  async fetch(request, env, ctx) {
    // Get the URL the user is requesting.
    const url = new URL(request.url);

    // Check if the path is for our new weather API endpoint.
    if (url.pathname === '/api/get-weather') {
      // --- This is our secure function logic ---
      // IMPORTANT: Replace this with your real, secret API key.
      const API_KEY = "654803d4318841a1900164803252407";
      const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=London`;
      
      try {
        const weatherResponse = await fetch(weatherApiUrl);
        // We will pass the response directly back to the user's browser.
        return weatherResponse;

      } catch (error) {
        return new Response('Error fetching weather data from external API', { status: 500 });
      }
      // --- End of secure function logic ---
    }

    // If the request is not for our API, just serve the static website files.
    // env.ASSETS.fetch() is the special Cloudflare function that serves your
    // index.html, CSS, images, etc.
    return env.ASSETS.fetch(request);
  },
};