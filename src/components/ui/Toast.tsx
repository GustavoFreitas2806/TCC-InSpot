import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 animate-in slide-in-from-right duration-300"
        >
          {toast.type === 'success' && <CheckCircle size={18} className="text-green-500 shrink-0" />}
          {toast.type === 'error' && <XCircle size={18} className="text-red-500 shrink-0" />}
          {toast.type === 'info' && <Info size={18} className="text-blue-500 shrink-0" />}
          <p className="text-sm text-gray-800 flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-0.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={14} className="text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
