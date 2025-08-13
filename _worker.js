// This is our new "traffic controller" that runs on Cloudflare's servers.
export default {
  async fetch(request, env, ctx) {
    // Get the URL the user is requesting.
    const url = new URL(request.url);

    // Check if the path is for our new weather API endpoint.
    if (url.pathname === '/api/get-weather') {
      // Get the city from the query parameter (e.g., /api/get-weather?city=Soweto)
      const city = url.searchParams.get('city');

      // If the user didn't provide a city, return an error.
      if (!city) {
        return new Response(JSON.stringify({ error: { message: 'City parameter is missing.' } }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // IMPORTANT: Replace this with your real, secret API key.
      const API_KEY = "YOUR_REAL_WEATHER_API_KEY_GOES_HERE";

      // Use the dynamic city from the user in the API URL.
      const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`;
      
      try {
        // Fetch the data from the real weather API.
        const weatherResponse = await fetch(weatherApiUrl);
        // Pass the response directly back to the user's browser.
        return weatherResponse;

      } catch (error) {
        return new Response('Error fetching weather data from external API', { status: 500 });
      }
    }

    // If the request is not for our API, just serve the static website files.
    // env.ASSETS.fetch() is the special Cloudflare function that serves your
    // index.html, CSS, images, etc.
    return env.ASSETS.fetch(request);
  },
};