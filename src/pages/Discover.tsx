import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Modal } from '../components/shared/Modal';
import { recipeDatabase, Recipe } from '../data/recipeDatabase';
import { swapDatabase } from '../data/swapDatabase';
import { nutriBotRules, getBotResponse } from '../data/nutriBotRules';
import { useUser } from '../contexts/UserContext';
import { useMealLog } from '../contexts/MealLogContext';
import { cn } from '../lib/utils';
import { MessageCircle, Send, X, AlertTriangle } from 'lucide-react';

export default function Discover() {
  const { user } = useUser();
  const { todayCalories } = useMealLog();

  const [recipeFilter, setRecipeFilter] = useState('All');
  const [swapFilter, setSwapFilter] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string}[]>([
    { sender: 'bot', text: `Hi ${user?.name.split(' ')[0]}! I'm NutriBot. Ask me anything about your diet and nutrition!` }
  ]);

  const recommendedRecipes = useMemo(() => {
    if (!user) return [];
    const remaining = user.dailyCalorieGoal - todayCalories;
    return recipeDatabase.map(r => {
      let score = 0;
      if (r.goalMatch.includes(user.goal as any)) score += 30;
      
      const meetsPrefs = user.preferences.every(p => {
        if (p === 'Vegetarian') return r.isVegetarian;
        if (p === 'Vegan') return r.isVegan;
        if (p === 'Gluten-Free') return r.isGlutenFree;
        return true;
      });
      if (meetsPrefs) score += 20;
      if (r.calories <= remaining) score += 25;
      if (user.dailyProteinGoal && r.protein > (user.dailyProteinGoal * 0.2)) score += 25;
      
      return { ...r, matchPercent: Math.min(score, 99) };
    }).sort((a, b) => b.matchPercent - a.matchPercent);
  }, [user, todayCalories]);

  const filteredRecipes = useMemo(() => {
    if (recipeFilter === 'Best Match') return recommendedRecipes.filter(r => r.matchPercent >= 80);
    if (recipeFilter === 'Low Calorie') return recommendedRecipes.filter(r => r.calories < 300);
    if (recipeFilter === 'High Protein') return recommendedRecipes.filter(r => r.protein > 20);
    if (recipeFilter === 'Quick') return recommendedRecipes.filter(r => (r.prepTime + r.cookTime) <= 15);
    if (recipeFilter === 'Vegetarian') return recommendedRecipes.filter(r => r.isVegetarian);
    if (recipeFilter === 'Indian') return recommendedRecipes.filter(r => r.isIndian);
    return recommendedRecipes;
  }, [recommendedRecipes, recipeFilter]);

  const filteredSwaps = useMemo(() => {
    if (swapFilter === 'All') return swapDatabase;
    return swapDatabase.filter(s => s.tags?.includes(swapFilter) || s.benefit.includes(swapFilter));
  }, [swapFilter]);

  const handleSendChat = (text: string) => {
    if (!text.trim()) return;
    setMessages(p => [...p, { sender: 'user', text }]);
    setChatInput('');
    setTimeout(() => {
      setMessages(p => [...p, { sender: 'bot', text: getBotResponse(text) }]);
    }, 500);
  };

  const getHeadsUp = () => {
    switch(user?.goal) {
      case 'weight_loss': return [
        { label: 'Sugary drinks', tip: 'Swap with sparkling water or unsweetened tea.' },
        { label: 'Fried foods', tip: 'Bake or air-fry your favorites instead.' },
        { label: 'White refined carbs', tip: 'Choose whole grains for lasting energy.' }
      ];
      case 'muscle_gain': return [
        { label: 'Empty calories', tip: 'Make every calorie count with nutrient-dense foods.' },
        { label: 'Alcohol', tip: 'It can inhibit muscle protein synthesis.' },
        { label: 'Skipping meals', tip: 'Stay consistent to maintain a caloric surplus.' }
      ];
      default: return [
        { label: 'Ultra-processed snacks', tip: 'Eat whole foods like nuts and fruits.' },
        { label: 'Excessive sodium', tip: 'Use herbs and spices to flavor food.' },
        { label: 'Trans fats', tip: 'Avoid artificial trans fats in baked goods.' }
      ];
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-20">
      <PageHeader title="Discover" />

      {/* Smart Recipes */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold">Recommended for You</h2>
          <span className="bg-light-accent dark:bg-dark-accent text-white text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold">
            {user?.goal.replace('_', ' ')}
          </span>
        </div>

        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar gap-2 mb-4">
          {['All', 'Best Match', 'Low Calorie', 'High Protein', 'Quick', 'Vegetarian', 'Indian'].map(f => (
            <button
              key={f}
              onClick={() => setRecipeFilter(f)}
              className={cn("px-4 py-1.5 rounded-full font-medium whitespace-nowrap text-sm transition-colors", recipeFilter === f ? "bg-light-text dark:bg-dark-text text-light-background dark:text-dark-background" : "bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:bg-light-alt")}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((r, i) => (
            <Card key={r.id} className="flex flex-col hover:-translate-y-1 transition-transform" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="relative h-32 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/40 dark:to-emerald-800/20 flex flex-col items-center justify-center mb-4 border border-light-border dark:border-dark-border">
                <span className="text-6xl absolute">{r.emoji}</span>
                <div className={cn(
                  "absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full text-white shadow-sm",
                  r.matchPercent >= 80 ? "bg-green-500" : r.matchPercent >= 60 ? "bg-amber-500" : "bg-gray-500"
                )}>
                  {r.matchPercent}% Match
                </div>
              </div>
              <h3 className="font-bold text-lg leading-tight mb-2">{r.name}</h3>
              <div className="flex items-center gap-3 text-xs text-light-secondary dark:text-dark-secondary mb-3 font-medium">
                <span>⏱ {r.prepTime + r.cookTime}min</span>
                <span>🔥 {r.calories} kcal</span>
                <span className="text-blue-500 dark:text-blue-400">💪 {r.protein}g</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {r.tags.map(t => <span key={t} className="text-[10px] bg-light-alt dark:bg-dark-alt px-1.5 py-0.5 rounded-sm uppercase tracking-wide font-bold text-light-secondary dark:text-dark-secondary">{t}</span>)}
              </div>
              <Button variant="outline" className="w-full mt-auto" onClick={() => setSelectedRecipe(r)}>View Recipe</Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Healthier Swaps */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Smarter Choices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSwaps.map((s, i) => (
            <div key={i} className="flex flex-col p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface shadow-sm hover:border-light-accent dark:hover:border-dark-accent transition-colors">
              <div className="flex items-center gap-2 mb-2 font-medium">
                <span className="line-through text-light-secondary dark:text-dark-secondary">{s.original}</span>
                <span className="text-lg">→</span>
                <span className="font-bold text-light-accent dark:text-dark-accent">{s.swap}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded">- {s.caloriesSaved} kcal</span>
                <span className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">✨ {s.benefit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Heads up */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Be Mindful Of
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getHeadsUp().map((hu, i) => (
            <Card key={i} className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10">
              <h3 className="font-bold text-amber-700 dark:text-amber-500 mb-1">{hu.label}</h3>
              <p className="text-sm font-medium">{hu.tip}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* NutriBot FAB */}
      <button 
        onClick={() => setChatOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 bg-light-accent dark:bg-dark-accent text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform z-40 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-dark-background">AI</span>
      </button>

      {/* NutriBot Panel */}
      <div className={cn(
        "fixed inset-0 md:inset-auto md:top-0 md:right-0 md:h-screen md:w-[380px] bg-white dark:bg-dark-surface shadow-2xl z-50 transition-transform duration-300 flex flex-col border-l border-light-border dark:border-dark-border",
        chatOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-background/50">
          <h2 className="font-bold flex items-center gap-2">NutriBot 🤖</h2>
          <button onClick={() => setChatOpen(false)} className="p-2 hover:bg-light-alt dark:hover:bg-dark-alt rounded-full"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("max-w-[85%] rounded-2xl p-3 text-sm animate-in fade-in slide-in-from-bottom-2", m.sender === 'user' ? 'bg-light-accent dark:bg-dark-accent text-white self-end rounded-br-sm' : 'bg-light-alt dark:bg-dark-alt self-start rounded-bl-sm')}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-light-border dark:border-dark-border">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-3 pb-1">
            {['What should I eat?', 'Am I hitting my protein goal?', 'Suggest a healthy snack'].map(qr => (
              <button key={qr} onClick={() => handleSendChat(qr)} className="whitespace-nowrap bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-3 py-1.5 rounded-full text-xs font-medium hover:bg-light-alt dark:hover:bg-dark-alt transition-colors">
                {qr}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat(chatInput)}
              placeholder="Ask anything..." 
              className="flex-1 bg-light-surface dark:bg-dark-background border border-light-border dark:border-dark-border rounded-full px-4 py-2 text-sm outline-none focus:border-light-accent"
            />
            <button onClick={() => handleSendChat(chatInput)} disabled={!chatInput.trim()} className="bg-light-accent dark:bg-dark-accent text-white p-2 rounded-full hover:bg-light-accent/90 disabled:opacity-50">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Modal */}
      <Modal isOpen={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} title="Recipe Details">
        {selectedRecipe && (
          <div className="flex flex-col gap-6 -mt-2">
            <div className="text-center bg-gradient-to-b from-green-50 to-transparent dark:from-green-900/20 py-6 -mx-4 border-b border-light-border dark:border-dark-border">
              <span className="text-6xl drop-shadow-sm">{selectedRecipe.emoji}</span>
              <h2 className="text-xl font-bold mt-2">{selectedRecipe.name}</h2>
              <div className="flex justify-center gap-4 text-sm font-medium mt-2">
                <span>⏱ {selectedRecipe.prepTime + selectedRecipe.cookTime}m</span>
                <span>🔥 {selectedRecipe.calories} kcal</span>
                <span className="text-blue-500">💪 {selectedRecipe.protein}g</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">Ingredients</h3>
              <ul className="flex flex-col gap-2">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3 bg-light-alt dark:bg-dark-alt px-3 py-2 rounded-lg text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-light-accent dark:bg-dark-accent"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3">Instructions</h3>
              <ol className="flex flex-col gap-4 pl-2">
                {selectedRecipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-4 text-sm">
                    <span className="font-bold text-light-accent dark:text-dark-accent">{i+1}.</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
