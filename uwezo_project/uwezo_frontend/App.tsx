import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { UploadPage } from "./components/UploadPage";
import { ResultsPage } from "./components/ResultsPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";

type Page = "upload" | "results" | "analytics" | "profile" | "settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("upload");

  const renderPage = () => {
    switch (currentPage) {
      case "upload":
        return <UploadPage />;
      case "results":
        return <ResultsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <UploadPage />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
