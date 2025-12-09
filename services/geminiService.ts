import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiRecommendation = async (query: string, contextItems: string): Promise<string> => {
  try {
    const prompt = `
      You are a sophisticated culinary concierge for "The Food Collective", an artisanal food marketplace in Zambia.
      Your tone is elegant, helpful, and knowledgeable, similar to a high-end farm shop assistant.
      
      The user asks: "${query}"
      
      Available products context: ${contextItems}
      
      Please recommend specific products from the context if applicable, or give general culinary advice related to Zambian ingredients if not.
      Keep the response concise (under 50 words) and inviting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I apologize, I am currently organizing the pantry. Please ask again in a moment.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Our concierge is currently busy. Please explore our collection below.";
  }
};