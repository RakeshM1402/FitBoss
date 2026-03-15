interface OpenFoodFactsProduct {
  nutriments?: {
    [key: string]: number | undefined;
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
  product_name?: string;
}

export interface FoodSearchResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const fetchFoodNutrition = async (foodName: string, grams: number): Promise<FoodSearchResult> => {
  const response = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&json=1&page_size=1`,
  );
  const data = await response.json();
  const product: OpenFoodFactsProduct | undefined = data?.products?.[0];

  if (!product?.nutriments) {
    throw new Error('Food item not found in OpenFoodFacts');
  }

  const multiplier = grams / 100;
  return {
    foodName: product.product_name || foodName,
    calories: Math.round((product.nutriments['energy-kcal_100g'] || 0) * multiplier),
    protein: Number(((product.nutriments.proteins_100g || 0) * multiplier).toFixed(1)),
    carbs: Number(((product.nutriments.carbohydrates_100g || 0) * multiplier).toFixed(1)),
    fat: Number(((product.nutriments.fat_100g || 0) * multiplier).toFixed(1)),
  };
};
