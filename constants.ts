import { FoodserviceInsight } from './types';

export const FOODSERVICE_DATA: FoodserviceInsight[] = [
    {
      id: "nursing-home", 
      title: "Healthcare & Nursing Homes", 
      insight_1: "Labor: Focus on IDDSI-compliant pre-thickened liquids and pre-sliced proteins to save 2+ prep hours daily.", 
      insight_2: "Profit: Suggest tray-card automation to reduce waste from 'missed' dietary requirements and eliminate over-serving.", 
      tip: "They win when they lower 'Cost-Per-Patient-Day' without sacrificing nutrition. Sell the 'fixed cost per plate'.", 
      type: "account",
      phone: "555-1001"
    },
    {
      id: "hotel", 
      title: "Hotels & Resorts", 
      insight_1: "Menu: Replace low-margin room service items with 'Grab & Go' high-profit snacks and gourmet pastries.", 
      insight_2: "Bar Mix: Suggest premium par-baked appetizers to drive beverage sales without extra FOH labor.", 
      tip: "Hotels struggle with 24/7 labor and consistency across shifts; sell products that require zero skill to plate.", 
      type: "account",
      phone: "555-1002"
    },
    {
      id: "food-truck",
      title: "Food Trucks & Mobile Catering",
      insight_1: "Space: Focus on versatile SKUs where one item is used in 5+ dishes to minimize inventory footprint.",
      insight_2: "Yield: Switch to pre-cut produce to eliminate prep-waste in tiny kitchens and maximize service speed.",
      tip: "Square footage is the bottleneck. Sell high-yield, small-footprint items that prep in seconds.",
      type: "account",
      phone: "555-1003"
    },
    {
      id: "school",
      title: "K-12 Education / Schools",
      insight_1: "Focus: USDA commodity tracking and 'Smart Snack' compliant items for easy federal reimbursement.",
      insight_2: "Labor: Suggest easy-to-serve finger foods to increase student participation rates during short lunch periods.",
      tip: "Federal reimbursement compliance is their #1 priority. If it's not compliant, it's not a sale.",
      type: "account",
      phone: "555-1005"
    },
    {
      id: "university",
      title: "College & University Dining",
      insight_1: "Trend: Plant-forward menu options and 'Ghost Kitchen' delivery concepts to appeal to Gen-Z students.",
      insight_2: "Sourcing: Bulk sustainable sourcing (local/organic) drives meal-plan retention and student satisfaction.",
      tip: "Sustainability and global flavors drive the contract. Sell the 'story' behind the product.",
      type: "account",
      phone: "555-1006"
    },
    {
      id: "restaurant", 
      title: "Independent Restaurant", 
      insight_1: "Profit: 60% of menus are underpriced. Audit the 'Stars' (High Profit/High Popularity) using menu engineering.", 
      insight_2: "Labor: Replace BOH vegetable prep and butchery with 'Value-Added' pre-cut produce and pre-portioned protein cuts.", 
      tip: "Don't talk about case price; talk about 'Plate Cost' and 'Contribution Margin'. The profit is in the yield.", 
      type: "account",
      phone: "555-1004"
    },
    {
      id: "meat", 
      title: "Center of Plate (Protein)", 
      insight_1: "The Hook: 'Are you paying staff to trim fat you've already paid for? What is your actual yield?'", 
      insight_2: "The Pitch: Processor-ready steaks ensure 100% yield and exact plate-costing while saving 2 hours of expert labor.", 
      tip: "The protein is the anchor. If you control the protein, you control the invoice. Focus on yield.", 
      type: "category"
    },
    {
      id: "appetizers", 
      title: "Appetizers & Bar Mix", 
      insight_1: "The Hook: 'Which item on your bar menu has the highest contribution margin? Is staff suggesting a second round?'", 
      insight_2: "The Pitch: Salty, savory appetizers drive 'second-round' beverage orders by 15%. A $9 app should cost you $1.50.", 
      tip: "Apps are the most profitable part of the menu. Every table needs an 'opener'.", 
      type: "category"
    },
    {
      id: "private-label", 
      title: "Exclusive/Private Brands", 
      insight_1: "The Hook: 'Why pay for a national brand's marketing budget when the quality spec is identical?'", 
      insight_2: "The Pitch: Our Exclusive Brands offer 'National Brand Equivalent' quality with a better margin for your bottom line.", 
      tip: "Private label is your shield against 'Price Shopping'. It's a product they can only get from YOU.", 
      type: "category"
    },
    {
      id: "chemicals", 
      title: "Kitchen & Bar Sanitation", 
      insight_1: "The Hook: 'Is a dirty glass or spotted fork costing you 5-star reviews and brand reputation?'", 
      insight_2: "The Pitch: Automated dispensing ensures zero waste and perfect sanitation every cycle. Protect your reputation.", 
      tip: "Service is the product here. If their machine is down, their business is down. Sell the peace of mind.", 
      type: "category"
    }
];