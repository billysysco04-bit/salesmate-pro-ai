import { GoogleGenAI, Type } from "@google/genai";
import { FoodserviceInsight, Ingredient } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDynamicAudit = async (query: string): Promise<FoodserviceInsight> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Conduct an aggressive, professional foodservice business audit for: "${query}". 
    
    CRITICAL: Do not give a generic "restaurant" answer. If the query is a specific cuisine, focus on:
    1. CUISINE-SPECIFIC LABOR: Identify high-prep items and suggest "speed-scratch" swaps.
    2. CUISINE-SPECIFIC PROFIT: Identify high-margin "stars" and optimize plate costs.
    3. THE HOOK: A tactical sales opening.
    
    Provide tactical, profit-driven insights for a sales consultant.`,
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
          type: { type: Type.STRING, description: "Must be 'account' or 'category'" }
        },
        required: ["id", "title", "insight_1", "insight_2", "tip", "type"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getIngredientCosts = async (text: string): Promise<Ingredient[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following list of food ingredients for a single plate and provide standard market wholesale costs for each based on the quantity provided.
    
    Ingredients: "${text}"
    
    Rules:
    - If quantity is missing, assume a standard portion size for a single restaurant entree.
    - Provide the cost as a decimal number (wholesale market average).
    - Be realistic but conservative.`,
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
                cost: { type: Type.NUMBER, description: "Market wholesale cost in USD" }
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
  const contextPrompt = currentContext 
    ? `The consultant is auditing a ${currentContext.title}.` 
    : "General sales consultation.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are 'SalesMate Buddy', a senior strategist. 
    ${contextPrompt}
    
    SPECIAL FEATURE: FLYER GENERATOR
    If the user asks for a flyer, menu (Happy Hour, Daily Specials), or recipe card, you MUST include a JSON block at the end of your message in this EXACT format:
    [FLYER_JSON]
    {
      "title": "Promotion Title",
      "subtitle": "Short tagline",
      "items": [{"name": "Item Name", "description": "Compelling description", "price": "$12.00", "margin": "75%"}],
      "recipe": {"name": "Signature Dish", "ingredients": ["Item A", "Item B"], "method": "Steps...", "marginNote": "Labor savings note"},
      "callToAction": "Order from [Distributor] today!"
    }
    [/FLYER_JSON]
    
    Consultant Question: "${userMessage}"`,
  });

  return response.text || "I'm processing the data...";

};

