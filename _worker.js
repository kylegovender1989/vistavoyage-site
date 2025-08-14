export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // This is the API endpoint your website will call.
    if (url.pathname === '/api/get-weather') {
      const city = url.searchParams.get('city');

      if (!city) {
        return new Response(JSON.stringify({ error: 'City parameter is missing.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // SECURELY get the API key from the environment variable you set in Cloudflare.
      const API_KEY = env.WEATHER_API_KEY;

      if (!API_KEY) {
        return new Response(JSON.stringify({ error: 'Server configuration error: API key not found.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`;
      
      try {
        const weatherResponse = await fetch(weatherApiUrl, {
          headers: { 'User-Agent': 'Cloudflare-Worker' }
        });
        return weatherResponse;

      } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching weather data.' }), { status: 500 });
      }
    }

    // For any other request, serve the static website files.
    return env.ASSETS.fetch(request);
  },
};
