import { GoogleGenAI, Type } from "@google/genai";
import { FoodserviceInsight, Ingredient } from "../types";

// Always create a new instance inside the call or via a helper to ensure key availability
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDynamicAudit = async (query: string): Promise<FoodserviceInsight> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Conduct an aggressive, professional foodservice business audit for: "${query}". Provide strategic insights into labor savings, menu engineering, and profit velocity. Use a professional, consulting tone. Return the results in a JSON format matching the schema.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          insight_1: { type: Type.STRING },
          insight_2: { type: Type.STRING },
          tip: { type: Type.STRING },
          type: { 
            type: Type.STRING,
            description: "Must be 'account' or 'category'"
          }
        },
        required: ["id", "title", "insight_1", "insight_2", "tip", "type"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getIngredientCosts = async (textInput: string): Promise<Ingredient[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following ingredients and provide estimated costs (in USD) and quantities for a standard high-volume foodservice plate: "${textInput}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.STRING },
                cost: { type: Type.NUMBER }
              },
              required: ["name", "quantity", "cost"]
            }
          }
        },
        required: ["ingredients"]
      }
    }
  });

  const data = JSON.parse(response.text || '{"ingredients": []}');
  return data.ingredients;
};

export const getBuddyResponse = async (userMessage: string, currentContext: FoodserviceInsight | null): Promise<string> => {
  const ai = getAI();
  const contextText = currentContext ? `The current client being audited is: ${currentContext.title}. Their primary strategies involve ${currentContext.insight_1}.` : 'No specific account selected yet.';
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are 'SalesMate Buddy', a highly tactical foodservice consultant. ${contextText} User query: "${userMessage}". Give short, high-impact advice. If the user asks for a promotional flyer or menu idea, return a JSON block for a flyer wrapped specifically in [FLYER_JSON] and [/FLYER_JSON].`,
  });

  return response.text || "I'm analyzing the profit vectors. One moment.";
};
