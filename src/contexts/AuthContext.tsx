import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import { userAPI, type UserData } from '@/lib/api';

interface User extends UserData {}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentialResponse: { credential: string }) => Promise<void>;
  logout: () => void;
  getAvatarUrl: () => string;
  syncUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple MD5 hash function for Gravatar
function md5(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sunride_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (credentialResponse: { credential: string }) => {
    try {
      // Decode JWT to get user info
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      
      // Use Google picture or generate Gravatar URL
      const email = payload.email || '';
      const googlePicture = payload.picture;
      const gravatarUrl = `https://www.gravatar.com/avatar/${md5(email.toLowerCase().trim())}?s=200&d=identicon`;
      
      const userData: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: googlePicture || gravatarUrl,
      };
      
      // Sync to MongoDB and get any additional user data
      try {
        let existingUser;
        try {
          existingUser = await userAPI.getByEmail(userData.email);
        } catch {
          existingUser = null;
        }

        if (!existingUser) {
          await userAPI.create({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            picture: userData.picture || ''
          });
          console.log('✅ New user created in MongoDB');
          setUser(userData);
          localStorage.setItem('sunride_user', JSON.stringify(userData));
        } else {
          // Merge MongoDB data (phone, address, isRider) with Google auth data
          const mergedUser: User = {
            ...userData,
            phone: existingUser.phone || '',
            address: existingUser.address || '',
            isRider: existingUser.isRider || false,
            riderApprovedAt: existingUser.riderApprovedAt
          };
          setUser(mergedUser);
          localStorage.setItem('sunride_user', JSON.stringify(mergedUser));
          console.log('✅ User data loaded from MongoDB');
        }
      } catch (error) {
        console.error('❌ Error syncing user to MongoDB:', error);
        // Fallback to local only
        setUser(userData);
        localStorage.setItem('sunride_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }, []);

  const syncUser = useCallback(async () => {
    if (!user) return;
    
    try {
      // Check if user exists in MongoDB
      let existingUser;
      try {
        existingUser = await userAPI.getByEmail(user.email);
      } catch {
        // User doesn't exist yet
        existingUser = null;
      }

      if (!existingUser) {
        // Create user in MongoDB
        await userAPI.create({
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture || '',
          phone: user.phone || '',
          address: user.address || ''
        });
        console.log('✅ User synced to MongoDB');
      } else {
        // Update existing user info if needed
        if (existingUser.name !== user.name || existingUser.picture !== user.picture) {
          await userAPI.update(user.id, {
            name: user.name,
            picture: user.picture || ''
          });
        }
        console.log('✅ User already in MongoDB');
      }
    } catch (error) {
      console.error('❌ Error syncing user:', error);
    }
  }, [user]);

  // Sync user on login
  useEffect(() => {
    if (user && !user.phone) {
      syncUser();
    }
  }, [user, syncUser]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sunride_user');
  }, []);

  const getAvatarUrl = useCallback(() => {
    if (!user) return '';
    if (user.picture) return user.picture;
    // Fallback to Gravatar
    return `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase().trim())}?s=200&d=identicon`;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        getAvatarUrl,
        syncUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
