import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface UploadedFile {
  file: File;
  id: string;
  timestamp: number;
}

export interface ProcessingResult {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  confidence: number;
  processingTime: number;
  documentType: string;
  country: string;
  fieldsDetected: number;
  totalFields: number;
  ocrText: string;
  extractedData: Record<string, any>;
  error?: string;
}

export interface AppState {
  currentPage: 'dashboard' | 'upload' | 'results' | 'analytics' | 'settings' | 'profile' | 'login' | 'signup' | 'admin';
  uploadedFiles: UploadedFile[];
  processingResults: ProcessingResult[];
  isLoading: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}

// Actions
type AppAction =
  | { type: 'SET_CURRENT_PAGE'; payload: AppState['currentPage'] }
  | { type: 'ADD_UPLOADED_FILE'; payload: UploadedFile }
  | { type: 'REMOVE_UPLOADED_FILE'; payload: string }
  | { type: 'ADD_PROCESSING_RESULT'; payload: ProcessingResult }
  | { type: 'UPDATE_PROCESSING_RESULT'; payload: { id: string; updates: Partial<ProcessingResult> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// Initial state
const initialState: AppState = {
  currentPage: 'dashboard',
  uploadedFiles: [],
  processingResults: [],
  isLoading: false,
  notifications: [],
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    
    case 'ADD_UPLOADED_FILE':
      return { ...state, uploadedFiles: [...state.uploadedFiles, action.payload] };
    
    case 'REMOVE_UPLOADED_FILE':
      return { 
        ...state, 
        uploadedFiles: state.uploadedFiles.filter(file => file.id !== action.payload) 
      };
    
    case 'ADD_PROCESSING_RESULT':
      return { ...state, processingResults: [...state.processingResults, action.payload] };
    
    case 'UPDATE_PROCESSING_RESULT':
      return {
        ...state,
        processingResults: state.processingResults.map(result =>
          result.id === action.payload.id
            ? { ...result, ...action.payload.updates }
            : result
        )
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
