import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface Admin {
  email: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'sunriderental21@gmail.com';
const ADMIN_PASSWORD = 'sunriderental21';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const saved = localStorage.getItem('sunride_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Validate credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminData: Admin = { email };
      setAdmin(adminData);
      localStorage.setItem('sunride_admin', JSON.stringify(adminData));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem('sunride_admin');
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAdminAuthenticated: !!admin,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
