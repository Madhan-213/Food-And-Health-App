import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Modal } from '../components/shared/Modal';
import { toast } from '../components/shared/Toast';
import { useMealLog } from '../contexts/MealLogContext';
import { foodDatabase, FoodItem } from '../data/foodDatabase';
import { cn } from '../lib/utils';
import { Search, X, Plus, Trash2 } from 'lucide-react';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverages'];

export default function MealLogger() {
  const { state } = useLocation();
  const defaultMealType = state?.mealType || 'breakfast';

  const { todayLog, addMeal, removeMeal } = useMealLog();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [addMealType, setAddMealType] = useState<string>(defaultMealType);

  const [showManual, setShowManual] = useState(false);
  const [manualData, setManualData] = useState({ name: '', cals: '', p: '', c: '', f: '' });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filteredFoods = useMemo(() => {
    let list = foodDatabase;
    if (filter !== 'All') {
      list = list.filter(f => f.category.toLowerCase() === filter.toLowerCase() || (filter === 'Beverages' && f.category === 'beverage'));
    }
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(lower) || f.tags.some(t => t.includes(lower)));
    }
    return list.slice(0, 50); // virtualize/limit for performance
  }, [debouncedSearch, filter]);

  const handleAdd = useCallback(() => {
    if (!selectedFood) return;
    const calories = selectedFood.caloriesPerServing * qty;
    const protein = selectedFood.protein * qty;
    const carbs = selectedFood.carbs * qty;
    const fat = selectedFood.fat * qty;

    addMeal({
      id: Math.random().toString(36).substr(2, 9),
      food: selectedFood,
      quantity: qty,
      mealType: addMealType.toLowerCase(),
      timestamp: Date.now(),
      totalCalories: calories,
      totalProtein: protein,
      totalCarbs: carbs,
      totalFat: fat
    });

    toast.show(`Added ${qty}x ${selectedFood.name} to ${addMealType}`);
    setSelectedFood(null);
    setQty(1);
    setSearch('');
  }, [selectedFood, qty, addMealType, addMeal]);

  const handleManualAdd = useCallback(() => {
    const cals = parseFloat(manualData.cals);
    if (!manualData.name || isNaN(cals)) {
      toast.show('Please enter name and valid calories', 'error');
      return;
    }
    addMeal({
      id: Math.random().toString(36).substr(2, 9),
      food: { name: manualData.name, servingUnit: 'serving' },
      quantity: 1,
      mealType: addMealType.toLowerCase(),
      timestamp: Date.now(),
      totalCalories: cals,
      totalProtein: parseFloat(manualData.p) || 0,
      totalCarbs: parseFloat(manualData.c) || 0,
      totalFat: parseFloat(manualData.f) || 0
    });
    toast.show(`Added custom food to ${addMealType}`);
    setManualData({ name: '', cals: '', p: '', c: '', f: '' });
    setShowManual(false);
  }, [manualData, addMealType, addMeal]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader title={`Log a Meal - ${new Date().toLocaleDateString()}`} />

      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar gap-2">
        <button 
          onClick={() => setFilter('All')} 
          className={cn("px-4 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors", filter === 'All' ? "bg-light-accent dark:bg-dark-accent text-white" : "bg-light-surface dark:bg-dark-surface hover:bg-light-alt border border-light-border dark:border-dark-border")}
        >
          All
        </button>
        {MEAL_TYPES.map(m => (
          <button 
            key={m} 
            onClick={() => setFilter(m)} 
            className={cn("px-4 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors", filter === m ? "bg-light-accent dark:bg-dark-accent text-white" : "bg-light-surface dark:bg-dark-surface hover:bg-light-alt border border-light-border dark:border-dark-border")}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-secondary dark:text-dark-secondary" />
        <input 
          type="text" 
          placeholder="Search 100+ foods..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-12 py-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-light-secondary hover:text-light-text dark:text-dark-secondary dark:hover:text-dark-text">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {filteredFoods.map(f => (
          <Card key={f.id} className="flex items-center justify-between p-3" onClick={() => setSelectedFood(f)}>
            <div>
              <p className="font-bold">{f.name}</p>
              <div className="flex gap-2 text-xs text-light-secondary dark:text-dark-secondary mt-1">
                <span className="bg-light-alt dark:bg-dark-alt px-2 py-0.5 rounded capitalize">{f.category}</span>
                <span>{f.servingSize} {f.servingUnit}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">{f.caloriesPerServing} kcal</span>
              <Button size="sm" variant="ghost" className="rounded-full w-8 h-8 p-0 border border-light-border dark:border-dark-border hover:bg-light-accent hover:text-white dark:hover:bg-dark-accent transition-colors" onClick={(e) => { e.stopPropagation(); setSelectedFood(f); }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
        {filteredFoods.length === 0 && (
          <div className="text-center py-8 text-light-secondary dark:text-dark-secondary">
            No foods found for '{search}'. Try manually adding it below!
          </div>
        )}
      </div>

      <Button variant="outline" className="w-full py-4 text-light-secondary dark:text-dark-secondary border-dashed border-2" onClick={() => setShowManual(!showManual)}>
        ➕ Add Custom Food
      </Button>

      {showManual && (
        <Card className="animate-in slide-in-from-top-2">
          <h3 className="font-bold mb-4">Manual Add</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Food Name" value={manualData.name} onChange={e => setManualData(m => ({...m, name: e.target.value}))} className="col-span-2 p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent" />
            <input type="number" placeholder="Calories" value={manualData.cals} onChange={e => setManualData(m => ({...m, cals: e.target.value}))} className="p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent" />
            <select value={addMealType} onChange={e => setAddMealType(e.target.value)} className="p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent capitalize">
              {MEAL_TYPES.map(m => <option key={m} value={m.toLowerCase()}>{m}</option>)}
            </select>
            <input type="number" placeholder="Protein (g)" value={manualData.p} onChange={e => setManualData(m => ({...m, p: e.target.value}))} className="p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent" />
            <input type="number" placeholder="Carbs (g)" value={manualData.c} onChange={e => setManualData(m => ({...m, c: e.target.value}))} className="p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent" />
            <input type="number" placeholder="Fat (g)" value={manualData.f} onChange={e => setManualData(m => ({...m, f: e.target.value}))} className="p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent" />
          </div>
          <Button className="w-full" onClick={handleManualAdd}>Save Custom Food</Button>
        </Card>
      )}

      <div className="mt-6 border-t border-light-border dark:border-dark-border pt-6">
        <h3 className="font-bold mb-4">Today's Log</h3>
        {todayLog.length === 0 ? (
          <div className="text-center py-8 text-light-secondary dark:text-dark-secondary flex flex-col items-center">
            <span className="text-4xl mb-2">🍽️</span>
            <p>No meals logged yet.<br/>Search above to add food!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {todayLog.map(m => (
              <Card key={m.id} className="flex items-center justify-between p-3">
                <div className="flex-1">
                  <p className="font-bold">{m.food.name}</p>
                  <p className="text-xs text-light-secondary dark:text-dark-secondary capitalize mt-1">
                    {m.quantity} {m.food.servingUnit} • {m.mealType}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-light-accent dark:text-dark-accent">{Math.round(m.totalCalories)} kcal</span>
                  <button onClick={() => removeMeal(m.id, todayStr)} className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedFood} onClose={() => setSelectedFood(null)} title="Add Food">
        {selectedFood && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-light-alt dark:bg-dark-alt p-4 rounded-xl">
              <div>
                <p className="font-bold text-lg">{selectedFood.name}</p>
                <p className="text-sm text-light-secondary dark:text-dark-secondary">Base: {selectedFood.caloriesPerServing} kcal / {selectedFood.servingSize} {selectedFood.servingUnit}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-2xl text-light-accent dark:text-dark-accent">{selectedFood.caloriesPerServing * qty} <span className="text-sm">kcal</span></p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity (Servings)</label>
              <input 
                type="number" 
                min="0.1" step="0.1" 
                value={qty} 
                onChange={e => setQty(parseFloat(e.target.value) || 1)}
                className="w-full p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Meal</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {MEAL_TYPES.filter(x => x !== 'All').map(m => (
                  <button
                    key={m}
                    onClick={() => setAddMealType(m)}
                    className={cn(
                      "p-2 text-sm rounded-lg border transition-colors",
                      addMealType.toLowerCase() === m.toLowerCase() ? "border-light-accent dark:border-dark-accent bg-light-accent/10 text-light-accent dark:text-dark-accent font-bold" : "border-light-border dark:border-dark-border"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center border-t border-light-border dark:border-dark-border pt-4">
              <div>
                <p className="text-sm font-bold text-blue-500">{Math.round(selectedFood.protein * qty)}g</p>
                <p className="text-xs text-light-secondary">Protein</p>
              </div>
              <div>
                <p className="text-sm font-bold text-orange-500">{Math.round(selectedFood.carbs * qty)}g</p>
                <p className="text-xs text-light-secondary">Carbs</p>
              </div>
              <div>
                <p className="text-sm font-bold text-yellow-500">{Math.round(selectedFood.fat * qty)}g</p>
                <p className="text-xs text-light-secondary">Fat</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="ghost" onClick={() => setSelectedFood(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleAdd} className="flex-1">Add to Log</Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
