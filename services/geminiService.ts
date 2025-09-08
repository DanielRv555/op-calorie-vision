import { GoogleGenAI, Type } from "@google/genai";
import type { NutritionData } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const identifyFoodInImage = async (imageFile: File, description: string): Promise<string[]> => {
  const base64Image = await fileToBase64(imageFile);
  const promptText = `Identifica todos los alimentos distintos en esta imagen. No incluyas condimentos o guarniciones a menos que sean una parte importante del plato. Responde con un array JSON de strings.${description ? `\n\nAquí hay una descripción adicional del usuario para dar más contexto: "${description}"` : ''}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: imageFile.type,
            data: base64Image,
          },
        },
        {
          text: promptText,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
      },
    },
  });
  
  try {
    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
        return result;
    }
    throw new Error("Estructura JSON inválida para la identificación de alimentos.");
  } catch (e) {
    console.error("Failed to parse food identification response:", response.text);
    throw new Error("No se pudo procesar la lista de alimentos de la respuesta de la IA.");
  }
};

export const getNutritionalInfo = async (imageFile: File, foodList: string[], description: string): Promise<NutritionData> => {
  const base64Image = await fileToBase64(imageFile);

  const prompt = `Basado en la imagen proporcionada y esta lista de alimentos identificados: ${foodList.join(', ')},${description ? ` y la siguiente descripción del usuario: "${description}",` : ''} proporciona un análisis nutricional aproximado para la comida completa. Estima el total de calorías, proteína en gramos, carbohidratos en gramos y grasa en gramos. Proporciona únicamente un objeto JSON con las claves "calories", "protein", "carbs" y "fat", con valores numéricos.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: imageFile.type,
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
        },
        required: ["calories", "protein", "carbs", "fat"],
      },
    },
  });

  try {
    const jsonStr = response.text.trim();
    const result: NutritionData = JSON.parse(jsonStr);
    if (typeof result.calories === 'number' && typeof result.protein === 'number' && typeof result.carbs === 'number' && typeof result.fat === 'number') {
        return result;
    }
    throw new Error("Estructura JSON inválida para los datos de nutrición.");
  } catch (e) {
    console.error("Failed to parse nutrition response:", response.text);
    throw new Error("No se pudieron procesar los datos nutricionales de la respuesta de la IA.");
  }
};