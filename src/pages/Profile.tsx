import React, { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { useUser } from '../contexts/UserContext';
import { useMealLog } from '../contexts/MealLogContext';
import { toast } from '../components/shared/Toast';
import { Download, Info, Trash2, Edit3, Settings } from 'lucide-react';

export default function Profile() {
  const { user, saveUser, resetUser } = useUser();
  const { allLogs, getWaterGlasses } = useMealLog();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    goal: user?.goal || '',
    dailyCalorieGoal: user?.dailyCalorieGoal || 2000,
    dailyProteinGoal: user?.dailyProteinGoal || 100,
  });

  const handleSave = () => {
    if (!user) return;
    saveUser({
      ...user,
      name: formData.name,
      goal: formData.goal,
      dailyCalorieGoal: Number(formData.dailyCalorieGoal),
      dailyProteinGoal: Number(formData.dailyProteinGoal),
    });
    setIsEditing(false);
    toast.show('Profile updated successfully');
  };

  const handleExport = () => {
    try {
      const exportData = {
        profile: user,
        logs: allLogs,
        dateExported: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutriwise_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.show('Data exported successfully');
    } catch (e) {
      toast.show('Failed to export data', 'error');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you ABSOLUTELY sure you want to delete all your data? This cannot be undone.')) {
      resetUser();
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-20 max-w-2xl mx-auto w-full">
      <PageHeader title="Profile & Settings" />

      <Card className="flex items-center gap-4 p-6 bg-gradient-to-br from-light-accent to-blue-500 dark:from-dark-accent dark:to-blue-700 text-white border-0 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Settings className="w-32 h-32" />
        </div>
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border-2 border-white/40">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="z-10">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="opacity-90 font-medium capitalize">{user.goal.replace('_', ' ')}</p>
          <div className="flex gap-4 mt-2 text-sm opacity-80">
            <span>{user.age} yrs</span> • <span>{user.height} {user.heightUnit}</span> • <span>{user.weight} {user.weightUnit}</span>
          </div>
        </div>
      </Card>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">My Goals</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit3 className="w-4 h-4 mr-2" /> {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
        
        <Card>
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                  className="w-full p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Calorie Target</label>
                  <input 
                    type="number" 
                    value={formData.dailyCalorieGoal} 
                    onChange={e => setFormData(p => ({...p, dailyCalorieGoal: e.target.value as any}))}
                    className="w-full p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Protein Target (g)</label>
                  <input 
                    type="number" 
                    value={formData.dailyProteinGoal} 
                    onChange={e => setFormData(p => ({...p, dailyProteinGoal: e.target.value as any}))}
                    className="w-full p-3 rounded-lg border border-light-border dark:border-dark-border bg-transparent outline-none focus:border-light-accent"
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="mt-2 text-white">Save Changes</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-sm text-light-secondary dark:text-dark-secondary mb-1">Calories</p>
                <p className="font-bold text-xl">{user.dailyCalorieGoal} <span className="text-sm font-normal">kcal/day</span></p>
              </div>
              <div>
                <p className="text-sm text-light-secondary dark:text-dark-secondary mb-1">Protein</p>
                <p className="font-bold text-xl">{user.dailyProteinGoal} <span className="text-sm font-normal">g/day</span></p>
              </div>
              <div>
                <p className="text-sm text-light-secondary dark:text-dark-secondary mb-1">Carbs</p>
                <p className="font-bold text-xl">{user.dailyCarbGoal} <span className="text-sm font-normal">g/day</span></p>
              </div>
              <div>
                <p className="text-sm text-light-secondary dark:text-dark-secondary mb-1">Fat</p>
                <p className="font-bold text-xl">{user.dailyFatGoal} <span className="text-sm font-normal">g/day</span></p>
              </div>
            </div>
          )}
        </Card>
      </section>

      <section className="mt-4">
        <h3 className="font-bold text-lg mb-4">Dietary Preferences</h3>
        <Card className="flex flex-wrap gap-2">
          {user.preferences.map(p => (
            <span key={p} className="px-3 py-1 bg-light-alt dark:bg-dark-alt rounded-full text-sm font-medium text-light-text dark:text-dark-text border border-light-border dark:border-dark-border">
              {p}
            </span>
          ))}
          {user.preferences.length === 0 && <span className="text-sm text-light-secondary">No restrictions set</span>}
        </Card>
      </section>

      <section className="mt-8 pt-6 border-t border-light-border dark:border-dark-border">
        <h3 className="font-bold text-lg mb-4">Data & Privacy</h3>
        <Card className="flex flex-col gap-2">
          <div className="flex items-start gap-3 p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-amber-800 dark:text-amber-500 text-sm mb-4">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>All your data is stored locally on this device. We do not use servers or databases to store your personal health info. If you clear your browser data, your NutriWise data will be lost forever.</p>
          </div>
          
          <Button variant="outline" className="w-full justify-start border-light-border dark:border-dark-border" onClick={handleExport}>
            <Download className="w-4 h-4 mr-3" />
            Export Data to JSON
          </Button>
          
          <Button variant="danger" className="w-full justify-start mt-2" onClick={handleReset}>
            <Trash2 className="w-4 h-4 mr-3" />
            Erase All Data
          </Button>
        </Card>
      </section>
      
      <div className="text-center text-xs text-light-secondary dark:text-dark-secondary mt-8">
        NutriWise v1.0.0 • Offline First
      </div>
    </div>
  );
}
