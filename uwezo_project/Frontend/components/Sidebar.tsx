import { Upload, FileText, BarChart3, User, Settings } from "lucide-react";
import { cn } from "./ui/utils";

type Page = "upload" | "results" | "analytics" | "profile" | "settings";

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: "upload" as Page, label: "Upload", icon: Upload },
    { id: "results" as Page, label: "Results", icon: FileText },
    { id: "analytics" as Page, label: "Analytics", icon: BarChart3 },
    { id: "profile" as Page, label: "Profile", icon: User },
    { id: "settings" as Page, label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-sidebar-foreground">Uwezo</h1>
        <p className="text-sidebar-foreground/60 text-sm">Document Verification</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    "hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
