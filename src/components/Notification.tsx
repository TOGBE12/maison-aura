import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Notification: React.FC = () => {
  const { toasts, removeToast, currentTheme } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          let Icon = Info;
          let iconColor = 'text-blue-500';
          let borderThick = 'border-l-4 border-blue-500';

          if (t.type === 'success') {
            Icon = Check;
            iconColor = 'text-[#D0A352]';
            borderThick = `border-l-4 border-[#D0A352]`;
          } else if (t.type === 'error') {
            Icon = X;
            iconColor = 'text-red-500';
            borderThick = 'border-l-4 border-red-500';
          } else if (t.type === 'info') {
            Icon = AlertCircle;
            iconColor = 'text-amber-500';
            borderThick = 'border-l-4 border-amber-500';
          }

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-neutral-100 ${borderThick} overflow-hidden`}
              id={`toast-${t.id}`}
            >
              <div className={`p-1 rounded-full bg-neutral-50 ${iconColor}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-neutral-800 uppercase tracking-widest font-mono">
                  Maison Aura
                </p>
                <p className="text-sm mt-0.5 text-neutral-600 font-sans">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                id={`toast-close-${t.id}`}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
