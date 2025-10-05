import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { UploadSection } from "./components/UploadSection";
import { ResultsPanel } from "./components/ResultsPanel";
import { AnalyticsWidget } from "./components/AnalyticsWidget";
import { FraudScoreVisualization } from "./components/FraudScoreVisualization";
import { CertificateDownload } from "./components/CertificateDownload";
import { ProfilePage } from "./components/ProfilePage";
import { AdminDashboard } from "./components/AdminDashboard";
import { LoginPage } from "./components/auth/LoginPage";
import { SignupPage } from "./components/auth/SignupPage";
import { NotificationSystem } from "./components/NotificationSystem";
import { useApp } from "./contexts/AppContext";
import { useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { state } = useApp();
  const { state: authState } = useAuth();

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'dashboard':
        return (
          <div className="space-y-6">
            <UploadSection />
            <ResultsPanel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FraudScoreVisualization 
                score={state.processingResults.length > 0 ? 
                  (state.processingResults[state.processingResults.length - 1].fraudScore || 0) : 0
                }
                status={state.processingResults.length > 0 ? 
                  (state.processingResults[state.processingResults.length - 1].fraudScore || 0) > 70 ? 'high' :
                  (state.processingResults[state.processingResults.length - 1].fraudScore || 0) > 30 ? 'medium' : 'low'
                  : 'low'
                }
                details={state.processingResults.length > 0 ? {
                  documentAuthenticity: Math.max(0, 100 - (state.processingResults[state.processingResults.length - 1].fraudScore || 0)),
                  textConsistency: Math.max(0, 100 - (state.processingResults[state.processingResults.length - 1].fraudScore || 0) * 0.8),
                  imageQuality: Math.max(0, 100 - (state.processingResults[state.processingResults.length - 1].fraudScore || 0) * 0.6),
                  patternMatching: Math.max(0, 100 - (state.processingResults[state.processingResults.length - 1].fraudScore || 0) * 1.2)
                } : undefined}
              />
              <CertificateDownload />
            </div>
            <AnalyticsWidget />
          </div>
        );
      case 'upload':
        return <UploadSection />;
      case 'results':
        return <ResultsPanel />;
      case 'analytics':
        return <AnalyticsWidget />;
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        );
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="space-y-6">
            <UploadSection />
            <ResultsPanel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FraudScoreVisualization 
                score={state.processingResults.length > 0 ? 
                  (state.processingResults[state.processingResults.length - 1].fraudScore || 0) : 0
                }
                status={state.processingResults.length > 0 ? 
                  (state.processingResults[state.processingResults.length - 1].fraudScore || 0) > 70 ? 'high' :
                  (state.processingResults[state.processingResults.length - 1].fraudScore || 0) > 30 ? 'medium' : 'low'
                  : 'low'
                }
                details={state.processingResults.length > 0 ? {
                  documentAuthenticity: Math.max(0, 100 - (state.processingResults[state.processingResults.length - 1].fraudScore || 0)),
                  textConsistency: Math.max(0, 100 - (state.processingResults[state.processingResults.length - 1].fraudScore || 0) * 0.8),
                  imageQuality: Math.max(0, 100 - (state.processingResults[state.processingResults.length - 1].fraudScore || 0) * 0.6),
                  patternMatching: Math.max(0, 100 - (state.processingResults[state.processingResults.length - 1].fraudScore || 0) * 1.2)
                } : undefined}
              />
              <CertificateDownload />
            </div>
            <AnalyticsWidget />
          </div>
        );
    }
  };

  // Show auth pages if not authenticated
  if (!authState.isAuthenticated && (state.currentPage === 'login' || state.currentPage === 'signup')) {
    return (
      <>
        {renderCurrentPage()}
        <NotificationSystem />
      </>
    );
  }

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <>
        <LoginPage />
        <NotificationSystem />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
      
      <NotificationSystem />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}