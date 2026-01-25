
import { GoogleGenAI } from "@google/genai";
import { Product } from "./types";

/**
 * Get expert shopping advice for a product using Gemini 3 Flash.
 * Follows @google/genai guidelines for API key usage and model interaction.
 */
export async function getProductAdvice(productName: string, userQuestion: string, currentCatalog: Product[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `Você é o Blee Assistant, o especialista em compras da Blee Shop. 
  Nossa loja é uma OFICINA DE CRIAÇÃO focada em IMPRESSÃO 3D e CANECAS PERSONALIZADAS. 
  Estes itens são fabricados por nós, com todo carinho do George.
  
  Também temos uma CURADORIA DE TECNOLOGIA que vendemos via Mercado Livre e Shopee para garantir segurança.
  
  Temos os seguintes produtos no catálogo: ${JSON.stringify(currentCatalog)}. 
  
  Sua tarefa:
  1. Responder dúvidas sobre o produto "${productName}".
  2. Se for um item 3D ou Caneca, enfatize que nós FABRICAMOS e o cliente deve pedir o orçamento no Dashboard.
  3. Se for eletrônico, informe que a venda é via canal oficial (ML ou Shopee).
  4. Use termos de abelha (colmeia, voo, pólen, mel, antenas).
  5. Enfatize a qualidade da fabricação manual da nossa oficina.
  6. Seja conciso e simpático.
  
  Responda sempre em Português do Brasil.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userQuestion,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    
    return response.text || "Puxa, minhas antenas perderam o sinal! Não consegui processar sua pergunta agora.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Minhas asas cansaram um pouco. Tente novamente em instantes!";
  }
}
