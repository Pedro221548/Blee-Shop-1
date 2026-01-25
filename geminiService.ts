
import { GoogleGenAI } from "@google/genai";
import { Product } from "./types";

/**
 * Get expert shopping advice for a product using Gemini 3 Flash.
 */
export async function getProductAdvice(productName: string, userQuestion: string, currentCatalog: Product[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `Você é o Blee Assistant, o especialista em compras da Blee Shop. 
  Nossa loja é uma OFICINA DE CRIAÇÃO focada em IMPRESSÃO 3D e CANECAS PERSONALIZADAS. 
  Estes itens são fabricados por nós, com todo carinho do George.
  
  Temos os seguintes produtos no catálogo: ${JSON.stringify(currentCatalog)}. 
  
  Sua tarefa:
  1. Responder dúvidas sobre o produto "${productName}".
  2. Use termos de abelha (colmeia, voo, pólen, mel, antenas).
  3. Enfatize a qualidade da fabricação manual da nossa oficina.
  4. Seja conciso e simpático.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userQuestion,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    
    return response.text || "Puxa, minhas antenas perderam o sinal!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Minhas asas cansaram um pouco. Tente novamente!";
  }
}

/**
 * Generates a realistic composite image using Gemini 2.5 Flash Image.
 * Fuses the user's room photo with a product description.
 */
export async function generateAIComposite(base64RoomImage: string, product: Product) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';

  // Extract base64 data (remove prefix if exists)
  const imageData = base64RoomImage.split(',')[1] || base64RoomImage;

  const prompt = `Realistically place this product: "${product.name} - ${product.description}" into the provided room photo. 
  The object should look like it's naturally sitting on a flat surface (table, shelf, or floor) in the image.
  Crucial: Match the lighting, shadows, and perspective of the room perfectly so it looks like a real photo, not a montage.
  The product is a high-quality ${product.category}.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageData,
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Nenhuma imagem gerada pela IA.");
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
