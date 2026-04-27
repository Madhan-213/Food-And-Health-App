import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserProfile } from '../contexts/UserContext';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { cn } from '../lib/utils';
import { ThemeToggle } from '../components/shared/ThemeToggle';

const goals = [
  { id: 'weight_loss', icon: '🏃', title: 'Lose Weight', desc: 'Burn fat and reach your ideal weight' },
  { id: 'muscle_gain', icon: '💪', title: 'Build Muscle', desc: 'Increase strength and muscle mass' },
  { id: 'eat_healthier', icon: '🥗', title: 'Eat Healthier', desc: 'Improve nutrition and energy levels' },
  { id: 'manage_condition', icon: '🩺', title: 'Manage Condition', desc: 'Support diabetes, cholesterol, or BP' },
];

const diets = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Halal', 'No Restrictions'];

export default function Onboarding() {
  const { saveUser } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [goal, setGoal] = useState('');
  const [prefs, setPrefs] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [hUnit, setHUnit] = useState<'cm'|'ft'>('cm');
  const [wUnit, setWUnit] = useState<'kg'|'lbs'>('kg');
  const [activity, setActivity] = useState('Lightly Active');

  const onNext = () => setStep(s => s + 1);
  const onPrev = () => setStep(s => s - 1);

  const togglePref = (p: string) => {
    if (p === 'No Restrictions') return setPrefs(['No Restrictions']);
    setPrefs(prev => {
      const filtered = prev.filter(x => x !== 'No Restrictions');
      if (filtered.includes(p)) return filtered.filter(x => x !== p);
      return [...filtered, p];
    });
  };

  const calculateGoal = useCallback(() => {
    const a = parseInt(age);
    let h = parseFloat(height);
    let w = parseFloat(weight);
    
    // Convert to metric if needed for Harris-Benedict (using male formula as base for simplicity, or we can average)
    if (hUnit === 'ft') {
      const [ft, in_] = height.split('.').map(parseFloat);
      h = ((ft || 0) * 12 + (in_ || 0)) * 2.54;
    }
    if (wUnit === 'lbs') w = w * 0.453592;

    // Just averaging men and women formula since gender wasn't asked in prompt
    // Avg BMR = (88.362 + 447.593)/2 + (13.397+9.247)/2 * w + (4.799+3.098)/2 * h - (5.677+4.330)/2 * a
    // Simpler: Use men's for now, or unified formula
    const bmr = 10 * w + 6.25 * h - 5 * a + 5; 
    
    let multiplier = 1.2;
    if (activity === 'Lightly Active') multiplier = 1.375;
    if (activity === 'Moderately Active') multiplier = 1.55;
    if (activity === 'Very Active') multiplier = 1.725;

    let cal = bmr * multiplier;
    if (goal === 'weight_loss') cal -= 500;
    if (goal === 'muscle_gain') cal += 300;

    return Math.round(cal / 50) * 50;
  }, [age, height, weight, activity, goal, hUnit, wUnit]);

  const onSubmit = () => {
    if (!name || !age || !height || !weight) return;
    
    const calGoal = calculateGoal();
    const newUser: UserProfile = {
      name,
      age: parseInt(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      heightUnit: hUnit,
      weightUnit: wUnit,
      goal,
      preferences: prefs,
      activityLevel: activity,
      dailyCalorieGoal: calGoal > 1200 ? calGoal : 1200,
      dailyProteinGoal: Math.round((calGoal * 0.3) / 4), // 30% protein
      dailyCarbGoal: Math.round((calGoal * 0.4) / 4), // 40% carbs
      dailyFatGoal: Math.round((calGoal * 0.3) / 9), // 30% fat
      waterGoal: 8,
      setupDate: new Date().toISOString()
    };
    saveUser(newUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background flex flex-col items-center justify-center p-4 transition-colors relative">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <Card className="w-full max-w-md p-6 sm:p-8 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <div className={cn("w-3 h-3 rounded-full transition-colors", step >= i ? "bg-light-accent dark:bg-dark-accent" : "bg-light-alt dark:bg-dark-alt")} />
              {i < 3 && <div className={cn("w-8 h-1 transition-colors", step > i ? "bg-light-accent dark:bg-dark-accent" : "bg-light-alt dark:bg-dark-alt")} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">What is your main goal?</h2>
            <div className="grid grid-cols-2 gap-4">
              {goals.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 text-center rounded-xl border-2 transition-all",
                    goal === g.id 
                      ? "border-light-accent dark:border-dark-accent bg-green-50 dark:bg-green-900/20" 
                      : "border-light-border dark:border-dark-border hover:border-light-accent/50 dark:hover:border-dark-accent/50"
                  )}
                >
                  <span className="text-3xl mb-2">{g.icon}</span>
                  <span className="font-semibold text-sm">{g.title}</span>
                  <span className="text-xs text-light-secondary dark:text-dark-secondary mt-1">{g.desc}</span>
                </button>
              ))}
            </div>
            <div className="mt-8">
              <Button className="w-full" disabled={!goal} onClick={onNext}>Continue</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">Any dietary preferences?</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {diets.map(d => {
                const isActive = prefs.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => togglePref(d)}
                    className={cn(
                      "px-4 py-2 rounded-full font-medium transition-all",
                      isActive 
                        ? "bg-light-accent dark:bg-dark-accent text-white" 
                        : "bg-light-alt dark:bg-dark-alt text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border"
                    )}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex gap-4">
              <Button variant="ghost" onClick={onPrev}>Back</Button>
              <Button className="flex-1" disabled={prefs.length === 0} onClick={onNext}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">Tell us about yourself</h2>
            
            <div className="space-y-3">
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent dark:focus:border-dark-accent" />
              <input type="number" placeholder="Age" min="10" max="100" value={age} onChange={e => setAge(e.target.value)} className="w-full p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent dark:focus:border-dark-accent" />
              
              <div className="flex gap-2">
                <input type="number" placeholder="Height" value={height} onChange={e => setHeight(e.target.value)} className="flex-1 p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent dark:focus:border-dark-accent" />
                <Button variant="outline" onClick={() => setHUnit(u => u === 'cm' ? 'ft' : 'cm')} className="w-16">{hUnit}</Button>
              </div>

              <div className="flex gap-2">
                <input type="number" placeholder="Weight" value={weight} onChange={e => setWeight(e.target.value)} className="flex-1 p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent dark:focus:border-dark-accent" />
                <Button variant="outline" onClick={() => setWUnit(u => u === 'kg' ? 'lbs' : 'kg')} className="w-16">{wUnit}</Button>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Activity Level</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'].map(act => (
                    <button
                      key={act}
                      onClick={() => setActivity(act)}
                      className={cn(
                        "p-2 text-sm rounded-lg border transition-colors",
                        activity === act ? "border-light-accent dark:border-dark-accent bg-light-accent/10 dark:bg-dark-accent/10" : "border-light-border dark:border-dark-border"
                      )}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button variant="ghost" onClick={onPrev}>Back</Button>
              <Button className="flex-1" onClick={onSubmit} disabled={!name || !age || !height || !weight}>Finish</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
