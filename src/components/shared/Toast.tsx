import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';

let toastTimeout: ReturnType<typeof setTimeout>;

export const toast = {
  listeners: [] as ((msg: string, type: 'success' | 'error') => void)[],
  show: (message: string, type: 'success' | 'error' = 'success') => {
    toast.listeners.forEach(l => l(message, type));
  },
  subscribe: (l: (msg: string, type: 'success' | 'error') => void) => {
    toast.listeners.push(l);
    return () => {
      toast.listeners = toast.listeners.filter(li => li !== l);
    }
  }
}

export const ToastContainer = () => {
  const [data, setData] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    return toast.subscribe((msg, type) => {
      setData({ msg, type });
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        setData(null);
      }, 3000);
    });
  }, []);

  if (!data) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom duration-200 fade-in w-[90%] max-w-md pointer-events-none">
      <div className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium w-full pointer-events-auto",
        data.type === 'success' ? 'bg-green-50 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50' : 'bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50'
      )}>
        {data.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
        <span className="flex-1">{data.msg}</span>
      </div>
    </div>
  );
};
