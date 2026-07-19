import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../services/firebase';

export type Language = 'English' | 'Spanish' | 'French' | 'Hindi' | 'Arabic' | 'Portuguese';
export type AccessibilityMode = 'none' | 'wheelchair' | 'visually-impaired';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  accessibilityMode: AccessibilityMode;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
  currentUser: User | null;
  authReady: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('English');
  const [accessibilityMode, setAccessibilityMode] = useState<AccessibilityMode>('none');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ language, setLanguage, accessibilityMode, setAccessibilityMode, currentUser, authReady }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
