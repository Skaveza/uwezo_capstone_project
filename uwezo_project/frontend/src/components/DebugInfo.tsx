import { useState } from 'react';
import { Info, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function DebugInfo() {
  const [isVisible, setIsVisible] = useState(false);

  const getStoredUsers = () => {
    try {
      const stored = localStorage.getItem('uwezo_users');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  };

  const users = getStoredUsers();

  const clearStorage = () => {
    localStorage.removeItem('uwezo_users');
    localStorage.removeItem('uwezo_user');
    window.location.reload();
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
            <Info className="w-4 h-4" />
            Debug Info - Available Accounts
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="h-6 w-6 p-0"
          >
            {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        </div>
      </CardHeader>
      {isVisible && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            <p className="text-xs text-blue-700 font-medium">Stored Accounts:</p>
            {users.length === 0 ? (
              <p className="text-xs text-blue-600">No accounts stored yet</p>
            ) : (
              <div className="space-y-1">
                {users.map((user: any) => (
                  <div key={user.id} className="text-xs bg-white p-2 rounded border">
                    <div className="font-medium">{user.name} ({user.role})</div>
                    <div className="text-gray-600">Email: {user.email}</div>
                    <div className="text-gray-500">Password: password</div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-blue-600">
                💡 All accounts use password: <code className="bg-white px-1 rounded">password</code>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearStorage}
                className="h-6 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
