import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Button } from "./ui/button";
import { useState } from "react";

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", message: "Document ID_2024_001 processed successfully", time: "5m ago", read: false },
  { id: "2", message: "High confidence score detected (98%)", time: "1h ago", read: false },
  { id: "3", message: "3 documents completed verification", time: "2h ago", read: true },
  { id: "4", message: "Monthly analytics report ready", time: "1d ago", read: true },
];

export function TopBar() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <div className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex-1">
        {/* Page title can be added here if needed */}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-blue-600 hover:bg-blue-600"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <h3>Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`w-full p-4 text-left border-b hover:bg-accent transition-colors ${
                      !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm flex-1">{notification.message}</p>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-accent rounded-lg px-3 py-2 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm">John Doe</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
