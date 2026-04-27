import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useMealLog } from '../contexts/MealLogContext';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { CalorieRing } from '../components/shared/CalorieRing';
import { MacroBar } from '../components/shared/MacroBar';
import { Button } from '../components/shared/Button';
import { Droplet, Flame, Lightbulb, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

const AI_TIPS = [
  "Eating slightly more protein can increase calories burned automatically.",
  "Drink water before meals to feel fuller and reduce total calorie intake.",
  "Chewing food thoroughly helps digestion and recognizing fullness.",
  "Sleep is crucial! Lack of sleep disrupts hunger hormones.",
  "Aim for 3 different colorful vegetables every day.",
  "Instead of avoiding carbs, prioritize complex carbs like oats and sweet potatoes.",
  "It takes 20 minutes for your brain to register you are full.",
  // Add more tips here, we'll just loop these
];

export default function Dashboard() {
  const { user } = useUser();
  const { streak, todayCalories, todayProtein, todayCarbs, todayFat, getWaterGlasses, setWaterGlasses, todayLog } = useMealLog();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const waterGlasses = getWaterGlasses(todayStr);

  const greeting = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return 'morning';
    if (hr < 18) return 'afternoon';
    return 'evening';
  }, []);

  const dayOfYear = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    return Math.floor(diff / 86400000);
  }, []);

  const tip = AI_TIPS[dayOfYear % AI_TIPS.length];

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { id: 'lunch', label: 'Lunch', emoji: '☀️' },
    { id: 'dinner', label: 'Dinner', emoji: '🌙' },
    { id: 'snack', label: 'Snacks', emoji: '🍎' },
  ];

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <PageHeader 
        title={<span className="font-bold">Good {greeting}, {user.name.split(' ')[0]}! 👋</span>} 
        showStreak 
        streakCount={streak} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center p-6 pb-2">
          <CalorieRing calories={todayCalories} goal={user.dailyCalorieGoal} className="mb-4" />
          <div className="grid grid-cols-3 w-full border-t border-light-border dark:border-dark-border pt-4 text-center">
            <div className="flex flex-col"><span className="text-sm font-bold text-light-text dark:text-dark-text">{todayCalories}</span><span className="text-xs text-light-secondary dark:text-dark-secondary">Eaten</span></div>
            <div className="flex flex-col border-x border-light-border dark:border-dark-border"><span className="text-sm font-bold text-light-text dark:text-dark-text">{Math.max(0, user.dailyCalorieGoal - todayCalories)}</span><span className="text-xs text-light-secondary dark:text-dark-secondary">Remaining</span></div>
            <div className="flex flex-col"><span className="text-sm font-bold text-light-text dark:text-dark-text">{user.dailyCalorieGoal}</span><span className="text-xs text-light-secondary dark:text-dark-secondary">Goal</span></div>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Droplet className="w-5 h-5 text-blue-500" /> Hydration</h3>
            <div className="flex flex-wrap gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <button 
                  key={i} 
                  onClick={() => setWaterGlasses(todayStr, i === waterGlasses ? i - 1 : i)}
                  className={cn(
                    "p-2 rounded-full transition-all hover:scale-110",
                    i <= waterGlasses ? "bg-blue-100 text-blue-500 dark:bg-blue-900/40" : "bg-light-alt dark:bg-dark-alt text-light-secondary dark:text-dark-secondary"
                  )}
                >
                  <Droplet className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
            <p className="text-center text-sm font-medium mt-2 text-light-secondary dark:text-dark-secondary">{waterGlasses} / 8 glasses</p>
          </Card>

          <Card className="flex-1 flex flex-col justify-center gap-4">
            <h3 className="font-semibold flex items-center gap-2">Today's Macros</h3>
            <MacroBar label="Protein" value={todayProtein} goal={user.dailyProteinGoal || 100} colorClass="bg-blue-500" />
            <MacroBar label="Carbs" value={todayCarbs} goal={user.dailyCarbGoal || 200} colorClass="bg-orange-500" />
            <MacroBar label="Fat" value={todayFat} goal={user.dailyFatGoal || 50} colorClass="bg-yellow-500" />
          </Card>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <h3 className="font-semibold p-4 border-b border-light-border dark:border-dark-border">Today's Meals</h3>
        <div className="flex flex-col">
          {mealTypes.map(mt => {
            const meals = todayLog.filter(m => m.mealType === mt.id);
            const totalCals = meals.reduce((sum, m) => sum + m.totalCalories, 0);
            return (
              <div key={mt.id} className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-alt/50 dark:hover:bg-dark-alt/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mt.emoji}</span>
                  <div>
                    <p className="font-medium">{mt.label}</p>
                    <p className="text-xs text-light-secondary dark:text-dark-secondary">
                      {meals.length} item{meals.length !== 1 ? 's' : ''} • {Math.round(totalCals)} kcal
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/log', { state: { mealType: mt.id } })} className="p-2">
                  <Plus className="w-5 h-5 text-light-accent dark:text-dark-accent" />
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-light-accent dark:border-l-dark-accent">
          <h3 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="w-5 h-5 text-yellow-500" /> Tip of the Day</h3>
          <p className="text-sm text-light-text dark:text-dark-text mb-3">{tip}</p>
          <button className="text-xs font-semibold text-light-accent dark:text-dark-accent">Another tip →</button>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{streak}-day streak</h3>
              <p className="text-sm text-light-secondary dark:text-dark-secondary">Keep logging those meals!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
