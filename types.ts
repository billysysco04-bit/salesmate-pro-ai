export interface FlyerData {
  title: string;
  subtitle?: string;
  items: { name: string; description: string; price?: string; margin?: string }[];
  recipe?: { name: string; ingredients: string[]; method: string; marginNote: string };
  callToAction: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
  cost: number;
}

export interface FoodserviceInsight {
  id: string;
  title: string;
  insight_1: string;
  insight_2: string;
  tip: string;
  type: 'account' | 'category';
  phone?: string;
  buddySuggestions?: string[];
  activeFlyer?: FlyerData | null;
}

export interface CalculationResult {
  sellPrice: number;
  cost: number;
  margin: number;
  marginPercent: number;
}

export interface ProposalState {
  auditData: FoodserviceInsight;
  calcData: CalculationResult;

}
