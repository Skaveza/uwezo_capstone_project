import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
  lastLogin: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
  signup: (email: string, password: string, name: string, onSuccess?: () => void) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
} | null>(null);

// Helper functions for user persistence
const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('uwezo_users');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem('uwezo_users', JSON.stringify(users));
};

const getInitialUsers = (): User[] => [
  {
    id: '1',
    email: 'admin@uwezo.ai',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
];

// Initialize users storage
const initializeUsers = () => {
  const storedUsers = getStoredUsers();
  if (storedUsers.length === 0) {
    const initialUsers = getInitialUsers();
    saveUsers(initialUsers);
    return initialUsers;
  }
  return storedUsers;
};

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize users storage and check for stored authentication on mount
  useEffect(() => {
    // Initialize users storage
    initializeUsers();
    
    // Check for stored authentication
    const storedUser = localStorage.getItem('uwezo_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('uwezo_user');
      }
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string, onSuccess?: () => void): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get users from storage
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    
    if (!user || password !== 'password') {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid email or password' });
      return;
    }
    
    // Update last login
    const updatedUser = { ...user, lastLogin: new Date().toISOString() };
    
    // Update user in storage
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    saveUsers(updatedUsers);
    
    // Store current user session
    localStorage.setItem('uwezo_user', JSON.stringify(updatedUser));
    
    dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
    
    // Call success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, name: string, onSuccess?: () => void): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get users from storage
    const users = getStoredUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'User with this email already exists' });
      return;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    
    // Add new user to storage
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    
    // Store current user session
    localStorage.setItem('uwezo_user', JSON.stringify(newUser));
    
    dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
    
    // Call success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('uwezo_user');
    dispatch({ type: 'LOGOUT' });
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) return;
    
    const updatedUser = { ...state.user, ...updates };
    
    // Update user in storage
    const users = getStoredUsers();
    const updatedUsers = users.map(u => u.id === state.user!.id ? updatedUser : u);
    saveUsers(updatedUsers);
    
    // Update current session
    localStorage.setItem('uwezo_user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  return (
    <AuthContext.Provider value={{
      state,
      dispatch,
      login,
      signup,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
