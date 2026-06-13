import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto cursor-pointer p-4 rounded-xl shadow-xl border flex items-center justify-between gap-3 text-white transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500'
                : toast.type === 'error'
                ? 'bg-gradient-to-r from-rose-600 to-red-600 border-rose-500'
                : toast.type === 'warning'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-500'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-500'
            }`}
          >
            <div className="flex-1 text-sm font-semibold">{toast.message}</div>
            <button className="text-white opacity-80 hover:opacity-100 text-lg font-bold">&times;</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
