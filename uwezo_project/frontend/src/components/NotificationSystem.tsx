import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function NotificationSystem() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    const timers = state.notifications.map(notification => 
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
      }, 5000)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [state.notifications, dispatch]);

  if (state.notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {state.notifications.map((notification) => {
        const getIcon = () => {
          switch (notification.type) {
            case 'success':
              return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'info':
              return <Info className="w-5 h-5 text-blue-600" />;
            default:
              return <Info className="w-5 h-5 text-gray-600" />;
          }
        };

        const getBgColor = () => {
          switch (notification.type) {
            case 'success':
              return 'bg-green-50 border-green-200';
            case 'error':
              return 'bg-red-50 border-red-200';
            case 'info':
              return 'bg-blue-50 border-blue-200';
            default:
              return 'bg-gray-50 border-gray-200';
          }
        };

        return (
          <div
            key={notification.id}
            className={`max-w-sm w-full bg-white border rounded-lg shadow-lg p-4 ${getBgColor()} transform transition-all duration-300 ease-in-out`}
          >
            <div className="flex items-start gap-3">
              {getIcon()}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
