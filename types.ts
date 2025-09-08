export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface GoalData extends NutritionData {}

export interface HistoryEntry {
  id: number;
  date: string;
  imageDataUrl: string;
  identifiedFoods: string[];
  nutritionInfo: NutritionData;
  mealDescription?: string;
}

export interface User {
  usuario: string;
  vendedor: string;
  vencimiento: string;
  diasRestantes: string;
}

export interface Recipe {
  nombre: string;
  ingredientes: string;
  preparacion: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  foto: string;
  video: string;
}

export type AppState =
  | 'idle'
  | 'image_uploaded'
  | 'identifying'
  | 'identified'
  | 'analyzing'
  | 'complete'
  | 'error'
  | 'viewing_history'
  | 'setting_goals'
  | 'viewing_settings'
  | 'viewing_recipes';
