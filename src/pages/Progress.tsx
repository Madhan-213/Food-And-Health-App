import React, { useMemo, useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { useMealLog } from '../contexts/MealLogContext';
import { useHabit, DailyHabits } from '../contexts/HabitContext';
import { useUser } from '../contexts/UserContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

const HABITS = [
  { id: 'breakfast', label: 'Ate Breakfast', emoji: '🍳' },
  { id: 'water', label: '8 Glasses Water', emoji: '💧' },
  { id: 'loggedMeals', label: 'Logged All Meals', emoji: '📝' },
  { id: 'protein', label: 'Hit Protein Goal', emoji: '🍗' },
  { id: 'noJunk', label: 'No Junk Food', emoji: '🚫' },
  { id: 'veggies', label: 'Ate Vegetables', emoji: '🥗' },
];

export default function Progress() {
  const { user } = useUser();
  const { allLogs } = useMealLog();
  const { todayHabits, toggleHabit } = useHabit();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<'calories'|'macros'>('calories');

  const chartData = useMemo(() => {
    if (!user) return [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const logs = allLogs[dateStr] || [];
      
      const cals = logs.reduce((sum, m) => sum + m.totalCalories, 0);
      const protein = logs.reduce((sum, m) => sum + m.totalProtein, 0);
      const carbs = logs.reduce((sum, m) => sum + m.totalCarbs, 0);
      const fat = logs.reduce((sum, m) => sum + m.totalFat, 0);

      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: Math.round(cals),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat)
      });
    }
    return data;
  }, [allLogs, user]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-20">
      <PageHeader title="Progress & Habits" />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Weekly Overview</h2>
          <div className="flex bg-light-alt dark:bg-dark-alt rounded-lg p-1">
            <button onClick={() => setActiveTab('calories')} className={cn("px-3 py-1 text-sm rounded-md font-medium transition-colors", activeTab === 'calories' ? "bg-white dark:bg-dark-surface shadow-sm text-light-text dark:text-dark-text" : "text-light-secondary dark:text-dark-secondary hover:text-light-text")}>Calories</button>
            <button onClick={() => setActiveTab('macros')} className={cn("px-3 py-1 text-sm rounded-md font-medium transition-colors", activeTab === 'macros' ? "bg-white dark:bg-dark-surface shadow-sm text-light-text dark:text-dark-text" : "text-light-secondary dark:text-dark-secondary hover:text-light-text")}>Macros</button>
          </div>
        </div>

        <Card className="h-[300px] w-full p-4 flex flex-col pt-6">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'calories' ? (
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: theme === 'dark' ? '#ffffff' : '#000000', fontWeight: 'bold' }}
                />
                <ReferenceLine y={user?.dailyCalorieGoal || 2000} stroke="#10b981" strokeDasharray="3 3" />
                <Bar dataKey="calories" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="protein" stroke="#3b82f6" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="carbs" stroke="#f97316" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="fat" stroke="#eab308" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Card>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-bold mb-4">Daily Habits Tracker</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {HABITS.map(h => {
            const isDone = !!todayHabits[h.id];
            return (
              <button
                key={h.id}
                onClick={() => toggleHabit(h.id, todayStr)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left outline-none focus-visible:ring-2 focus-visible:ring-light-accent dark:focus-visible:ring-dark-accent",
                  isDone 
                    ? "bg-light-accent/10 border-light-accent text-light-accent dark:bg-dark-accent/20 dark:border-dark-accent dark:text-dark-accent" 
                    : "bg-white border-light-border text-light-text dark:bg-dark-surface dark:border-dark-border dark:text-dark-text hover:border-light-accent/50 dark:hover:border-dark-accent/50"
                )}
              >
                <span className="text-2xl">{h.emoji}</span>
                <span className="font-medium text-sm leading-tight flex-1">{h.label}</span>
                <div className="flex-shrink-0">
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 opacity-30" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
