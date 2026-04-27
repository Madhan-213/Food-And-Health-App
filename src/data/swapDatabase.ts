export interface Swap {
  original: string;
  swap: string;
  caloriesSaved: number;
  benefit: string;
  tags: string[];
}

export const swapDatabase: Swap[] = [
  { original: 'White Rice', swap: 'Cauliflower Rice', caloriesSaved: 150, benefit: 'Lower Carb', tags: ['Weight Loss', 'Lower Carb'] },
  { original: 'White Bread', swap: 'Whole Wheat Bread', caloriesSaved: 20, benefit: 'More Fiber', tags: ['Weight Loss', 'More Fiber'] },
  { original: 'Fried Egg', swap: 'Poached Egg', caloriesSaved: 90, benefit: 'Less Fat', tags: ['Weight Loss', 'Lower Carb'] },
  { original: 'Soda', swap: 'Sparkling Water with Lemon', caloriesSaved: 140, benefit: 'No Sugar', tags: ['Weight Loss', 'Lower Carb'] },
  { original: 'Chips', swap: 'Air-popped Popcorn', caloriesSaved: 80, benefit: 'More Fiber', tags: ['Weight Loss', 'More Fiber'] },
  { original: 'Butter', swap: 'Avocado Spread', caloriesSaved: 50, benefit: 'Healthy Fats', tags: ['Eat Healthier', 'Muscle Gain'] },
  { original: 'Mayonnaise', swap: 'Greek Yogurt Dip', caloriesSaved: 70, benefit: 'More Protein', tags: ['Muscle Gain', 'Eat Healthier'] },
  { original: 'White Pasta', swap: 'Zucchini Noodles', caloriesSaved: 160, benefit: 'Lower Carb', tags: ['Weight Loss', 'Lower Carb'] },
  { original: 'Ice Cream', swap: 'Frozen Banana Nice Cream', caloriesSaved: 120, benefit: 'No Added Sugar', tags: ['Weight Loss', 'Eat Healthier'] },
  { original: 'Fruit Juice', swap: 'Whole Fruit', caloriesSaved: 60, benefit: 'More Fiber', tags: ['Weight Loss', 'More Fiber'] },
  { original: 'Refined Sugar', swap: 'Honey', caloriesSaved: 15, benefit: 'Lower GI', tags: ['Eat Healthier'] },
  { original: 'Full Fat Milk', swap: 'Almond Milk', caloriesSaved: 60, benefit: 'Less Fat', tags: ['Weight Loss'] },
  { original: 'Samosa', swap: 'Baked Handvo', caloriesSaved: 100, benefit: 'More Fiber', tags: ['Weight Loss', 'More Fiber'] },
  { original: 'Paratha with Butter', swap: 'Roti with Ghee', caloriesSaved: 80, benefit: 'Less Saturated Fat', tags: ['Eat Healthier', 'Weight Loss'] },
  { original: 'Fried Chicken', swap: 'Tandoori Chicken', caloriesSaved: 130, benefit: 'Less Fat', tags: ['Muscle Gain', 'Weight Loss'] }
];
