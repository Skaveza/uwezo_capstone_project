import { 
  LayoutDashboard, 
  Upload, 
  CheckCircle, 
  BarChart3, 
  Settings, 
  User,
  Shield,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" as const },
  { icon: Upload, label: "Upload Documents", page: "upload" as const },
  { icon: CheckCircle, label: "Verification Results", page: "results" as const },
  { icon: BarChart3, label: "Analytics", page: "analytics" as const },
  { icon: Settings, label: "Settings", page: "settings" as const },
  { icon: User, label: "Profile", page: "profile" as const },
];

export function Sidebar() {
  const { state, dispatch } = useApp();
  const { state: authState, logout } = useAuth();

  const handleNavigation = (page: typeof state.currentPage) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  const handleLogout = () => {
    logout();
    // The App component will automatically redirect to login when not authenticated
  };

  // Add admin menu item if user is admin
  const allMenuItems = authState.user?.role === 'admin' 
    ? [...menuItems, { icon: Shield, label: "Admin Dashboard", page: "admin" as const }]
    : menuItems;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold">U</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Uwezo AI</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {allMenuItems.map((item) => (
            <li key={item.label}>
              <Button
                variant={state.currentPage === item.page ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  state.currentPage === item.page
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => handleNavigation(item.page)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {authState.user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {authState.user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {authState.user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}