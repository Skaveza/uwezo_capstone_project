import { Bell, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";

export function TopBar() {
  const { state: authState } = useAuth();
  const { state: appState } = useApp();

  const getPageTitle = () => {
    switch (appState.currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'upload': return 'Upload Documents';
      case 'results': return 'Verification Results';
      case 'analytics': return 'Analytics';
      case 'settings': return 'Settings';
      case 'profile': return 'Profile';
      case 'admin': return 'Admin Dashboard';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
            {appState.notifications.length}
          </Badge>
        </Button>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={authState.user?.avatar} />
            <AvatarFallback>
              {authState.user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{authState.user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{authState.user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}