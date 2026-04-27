export interface BotRule {
  keywords: string[];
  response: string;
}

export const nutriBotRules: BotRule[] = [
  // Meal Suggestions
  { keywords: ['breakfast', 'morning'], response: 'For breakfast, try something high in protein and fiber, like oatmeal with almonds, or a veggie omelette!' },
  { keywords: ['lunch', 'afternoon'], response: 'A balanced lunch could be a grilled chicken salad or rajma chawal (kidney beans with brown rice).' },
  { keywords: ['dinner', 'night'], response: 'Keep dinner light but satisfying! Stir fry tofu or baked fish with a side of steamed veggies are great.' },
  { keywords: ['snack', 'hungry between'], response: 'Healthy snacks include Greek yogurt, a small handful of almonds, or cucumber sticks with hummus.' },
  
  // Macros & Calories
  { keywords: ['protein', 'hitting protein', 'muscle'], response: 'Protein is essential! Good sources are chicken, tofu, lentils, greek yogurt, and eggs.' },
  { keywords: ['carbs', 'carbohydrates'], response: 'Carbs give you energy. Choose complex carbs like sweet potatoes, oats, and brown rice.' },
  { keywords: ['fat', 'fats'], response: 'Healthy fats like those in avocados, nuts, and olive oil are important for hormone health and satiety!' },
  { keywords: ['calories', 'deficit', 'surplus'], response: 'Your daily calorie target is determined by your specific goal (loss, gain, or maintenance). Track your meals in the Logger to stay on top of it!' },
  
  // Hydration
  { keywords: ['water', 'drink', 'hydration', 'fluid'], response: 'Try to drink at least 8 glasses of water a day. Dehydration can often be mistaken for hunger!' },
  
  // Goal specific
  { keywords: ['weight loss', 'lose weight', 'fat'], response: 'For weight loss, focus on a sustainable calorie deficit, high protein intake to preserve muscle, and consistent hydration.' },
  { keywords: ['muscle gain', 'build muscle', 'bulking'], response: 'To build muscle, be in a slight caloric surplus, prioritize protein, and engage in resistance training.' },
  { keywords: ['healthier', 'eat healthy'], response: 'To eat healthier, focus on whole, minimally processed foods. Add more colors (vegetables and fruits) to your plate!' },
  { keywords: ['condition', 'manage'], response: 'For managing conditions like BP or cholesterol, reduce sodium and saturated fat. Always consult your doctor for personalized advice.' },
  
  // Swaps and general foods
  { keywords: ['sugar', 'sweet'], response: 'Craving sugar? Have a piece of fruit! Whole fruits have fiber which balances the sugar spike.' },
  { keywords: ['avoid', 'limit', 'bad food'], response: 'Try to limit ultra-processed foods, deep-fried snacks, and sugary drinks. But remember, no food is strictly off-limits in moderation!' },
  { keywords: ['cheat', 'junk'], response: 'It\'s okay to enjoy your favorite foods occasionally! The 80/20 rule (80% whole foods, 20% treats) is a sustainable approach.' },
  
  // Random / Greetings
  { keywords: ['hi', 'hello', 'hey'], response: 'Hello! NutriBot here. Ask me anything about nutrition, meal ideas, or your health goals!' },
  { keywords: ['thank', 'thanks'], response: 'You\'re very welcome! Stay healthy! 🍏' },
  { keywords: ['help'], response: 'I can suggest meals, explain macros, suggest food swaps, or give hydration tips. What do you need help with?' },
  
  // Extra detailed items to hit 30+ concepts via mapped matching
  { keywords: ['vegan', 'plant based'], response: 'Great vegan protein sources include lentils, chickpeas, tofu, tempeh, and quinoa.' },
  { keywords: ['vegetarian', 'veg'], response: 'Vegetarians can get protein from paneer, eggs (if eaten), milk, yogurt, and plentiful legumes.' },
  { keywords: ['rice', 'roti', 'carbs'], response: 'Both rice and roti are fine! Whole wheat roti has a bit more fiber, but portion control is what matters most.' },
  { keywords: ['late night', 'midnight'], response: 'Late night cravings? Try a glass of warm milk, a small cup of yogurt, or a few almonds.' },
  { keywords: ['tired', 'energy', 'fatigue'], response: 'Low energy? You might need more water or a small complex carb snack like an apple.' },
  { keywords: ['bloating', 'bloated'], response: 'Bloating can be from eating too fast, too much sodium, or certain high-FODMAP foods. Drink water and take a brief walk!' },
  { keywords: ['pre workout', 'before gym'], response: 'A pre-workout snack should be easily digestible carbs, like a banana or a slice of toast with honey.' },
  { keywords: ['post workout', 'after gym'], response: 'After a workout, aim for protein to rebuild muscle and some carbs to replenish energy. A protein shake or eggs works well!' },
  { keywords: ['fasting', 'intermittent'], response: 'Intermittent fasting is a tool for calorie restriction. It\'s not magic, but it helps some people control their intake. Stay hydrated during fasts!' },
  { keywords: ['sleep', 'insomnia'], response: 'Good sleep is crucial for weight management! Avoid heavy meals, caffeine, and bright screens before bedtime.' },
  { keywords: ['salt', 'sodium'], response: 'Watch your sodium intake as it can cause water retention. Many packaged foods have hidden sodium!' }
];

export const getBotResponse = (input: string): string => {
  const normalizedInput = input.toLowerCase();
  for (const rule of nutriBotRules) {
    if (rule.keywords.some(kw => normalizedInput.includes(kw))) {
      return rule.response;
    }
  }
  return "Great question! Focus on whole foods, stay hydrated, and track your meals consistently. 🥗";
};
