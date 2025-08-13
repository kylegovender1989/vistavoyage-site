// This is the backend function that will run securely on a server.
// It is the "chef" in our restaurant analogy.

export async function onRequest(context) {
  // 1. Define the secret API key and the API URL.
  //    These are kept securely on the server and are never sent to the user's browser.
  const API_KEY = "YOUR_REAL_WEATHER_API_KEY_GOES_HERE"; 
  const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=London`;

  try {
    // 2. The server makes the "real" API call using the secret key.
    const apiResponse = await fetch(API_URL);

    // Check if the request to the weather API was successful.
    if (!apiResponse.ok) {
      throw new Error(`Weather API responded with status: ${apiResponse.status}`);
    }

    // 3. Get the data from the weather API.
    const weatherData = await apiResponse.json();

    // 4. Send the weather data back to the user's browser (the frontend).
    //    We use a new Response object to do this.
    return new Response(JSON.stringify(weatherData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    // 5. If anything goes wrong, send back an error message.
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}