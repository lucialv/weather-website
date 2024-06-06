export const GET = async ({ params }) => {
  try {
    const input = params.id;
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${
        import.meta.env.WEATHER_API_KEY
      }&q=${input}`,
      {},
    );

    if (!response.ok) {
      throw new Error("No se pudo obtener la respuesta de la API");
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Permitir solicitudes desde cualquier origen
      },
    });
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Permitir solicitudes desde cualquier origen
      },
    });
  }
};
