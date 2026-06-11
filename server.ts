import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("ADVERTENCIA: GEMINI_API_KEY no está configurada.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Route for Nearby Place Recommendations
app.post("/api/recommendations", async (req, res) => {
  try {
    const { placeName, locationName, userLocation } = req.body;
    
    const ai = getGeminiClient();
    let prompt = "";

    if (placeName) {
      const locationContext = userLocation 
        ? `(El usuario se encuentra actualmente en las coordenadas: ${userLocation.latitude}, ${userLocation.longitude})` 
        : (locationName ? `(ubicado en ${locationName})` : `(cerca de ${placeName})`);
        
      prompt = `Como un guía turístico experto de clase mundial, sugiere exactamente 3 atracciones turísticas adicionales, miradores espectaculares, cafeterías hermosas, restaurantes locales o lugares hermosos muy cercanos a "${placeName}" ${locationContext}.
Estas recomendaciones deben ser muy cercanas físicamente, prácticas para complementar la visita a este lugar, atractivas para viajeros, y redactadas de forma impecable en español.`;
    } else if (userLocation) {
      prompt = `Como un guía turístico experto de clase mundial, el usuario se encuentra actualmente en las coordenadas GPS: ${userLocation.latitude}, ${userLocation.longitude}. 
Sugiere exactamente 5 atracciones turísticas imperdibles, monumentos, parques o lugares de interés que se encuentren muy cerca de esta ubicación exacta.
Sé específico con los nombres y proporciona una descripción útil y cautivadora en español.`;
    } else {
      return res.status(400).json({ error: "Se requiere un lugar de referencia (placeName) o una ubicación GPS (userLocation)." });
    }
      
    prompt += `
Debes devolver obligatoriamente los resultados estructurados en formato JSON válido. La respuesta debe consistir de manera estricta de un único JSON array con la siguiente estructura de datos:
[
  {
    "name": "Nombre exacto y cautivador del lugar sugerido",
    "description": "Una frase corta, atractiva y descriptiva (máximo 15 palabras) explicando por qué vale la pena.",
    "type": "Cercano | Comida | Mirador | Opcional"
  }
]

No incluyas introducciones dramáticas, ni explicaciones adicionales fuera del array, ni marcas de bloque de código markdown de tipo \`\`\`json. Devuelve única y directamente la cadena del JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonText = response.text || "[]";
    const recommendations = JSON.parse(jsonText.trim());

    res.json({ recommendations });
  } catch (error: any) {
    console.error("Error al llamar a Gemini:", error);
    res.status(500).json({ error: error.message || "Fallo interno al procesar las sugerencias con la IA." });
  }
});

// Wrap server startup and middleware registration in an async function to avoid top-level await in CJS output
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express Server] Corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fallo al inicializar el servidor Express:", err);
});
