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

interface USDAFoodNutrient {
  nutrientName?: string;
  unitName?: string;
  value?: number;
}

interface USDAFood {
  description?: string;
  foodNutrients?: USDAFoodNutrient[];
  brandOwner?: string;
}

export interface FoodSearchResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: 'USDA FoodData Central' | 'OpenFoodFacts';
}

const usdaApiKey = process.env.EXPO_PUBLIC_USDA_API_KEY ?? 'DEMO_KEY';

const scaleNutrient = (per100g: number, grams: number) => Number(((per100g * grams) / 100).toFixed(1));

const findUsdaNutrient = (
  nutrients: USDAFoodNutrient[] | undefined,
  names: string[],
  preferredUnit?: string,
) => {
  const preferredMatch = nutrients?.find(
    (item) => item.nutrientName && names.includes(item.nutrientName) && (!preferredUnit || item.unitName === preferredUnit),
  );
  if (preferredMatch?.value) {
    return preferredMatch.value;
  }

  const match = nutrients?.find((item) => item.nutrientName && names.includes(item.nutrientName));
  return match?.value ?? 0;
};

const fetchFromUsda = async (foodName: string, grams: number): Promise<FoodSearchResult | null> => {
  const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(usdaApiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: foodName,
      pageSize: 5,
      dataType: ['Foundation', 'SR Legacy', 'Survey (FNDDS)', 'Branded'],
      sortBy: 'dataType.keyword',
      sortOrder: 'asc',
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const match: USDAFood | undefined = data?.foods?.find((item: USDAFood) => item.foodNutrients?.length);

  if (!match?.foodNutrients?.length) {
    return null;
  }

  const caloriesPer100g = findUsdaNutrient(match.foodNutrients, ['Energy'], 'KCAL');
  const proteinPer100g = findUsdaNutrient(match.foodNutrients, ['Protein']);
  const carbsPer100g = findUsdaNutrient(match.foodNutrients, ['Carbohydrate, by difference']);
  const fatPer100g = findUsdaNutrient(match.foodNutrients, ['Total lipid (fat)']);

  if (!caloriesPer100g) {
    return null;
  }

  const label = [match.description, match.brandOwner].filter(Boolean).join(' | ');

  return {
    foodName: label || foodName,
    calories: Math.round(scaleNutrient(caloriesPer100g, grams)),
    protein: scaleNutrient(proteinPer100g, grams),
    carbs: scaleNutrient(carbsPer100g, grams),
    fat: scaleNutrient(fatPer100g, grams),
    source: 'USDA FoodData Central',
  };
};

const fetchFromOpenFoodFacts = async (foodName: string, grams: number): Promise<FoodSearchResult | null> => {
  const response = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&json=1&page_size=5`,
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const product: OpenFoodFactsProduct | undefined = data?.products?.find(
    (item: OpenFoodFactsProduct) => item?.nutriments?.['energy-kcal_100g'],
  );

  if (!product?.nutriments) {
    return null;
  }

  return {
    foodName: product.product_name || foodName,
    calories: Math.round(scaleNutrient(product.nutriments['energy-kcal_100g'] || 0, grams)),
    protein: scaleNutrient(product.nutriments.proteins_100g || 0, grams),
    carbs: scaleNutrient(product.nutriments.carbohydrates_100g || 0, grams),
    fat: scaleNutrient(product.nutriments.fat_100g || 0, grams),
    source: 'OpenFoodFacts',
  };
};

export const fetchFoodNutrition = async (foodName: string, grams: number): Promise<FoodSearchResult> => {
  const usdaResult = await fetchFromUsda(foodName, grams);
  if (usdaResult) {
    return usdaResult;
  }

  const offResult = await fetchFromOpenFoodFacts(foodName, grams);
  if (offResult) {
    return offResult;
  }

  throw new Error('Food item not found in available nutrition sources');
};
