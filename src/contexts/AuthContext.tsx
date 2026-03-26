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
  updateUserProfile: (profileData: { phone?: string; address?: string }) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);

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
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: googlePicture || gravatarUrl,
      };
      
      // Store Google user data in MongoDB for persistence
      // No localStorage - user data will be fetched from MongoDB on app load
      
      // Sync to MongoDB and get any additional user data
      try {
        let existingUser;
        try {
          console.log('🔄 Checking for existing user in MongoDB:', email);
          existingUser = await userAPI.getByEmail(email);
        } catch {
          existingUser = null;
        }

        if (!existingUser) {
          // Create new user in MongoDB
          const newUser = {
            id: payload.sub,
            googleId: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: googlePicture || gravatarUrl,
            phone: '',
            address: '',
            isRider: false,
            createdAt: new Date().toISOString()
          };
          await userAPI.create(newUser);
          console.log('✅ New user created in MongoDB:', newUser);
        
          // Update local React state
          setUser(newUser);
          console.log('✅ User created in MongoDB during sync:', newUser);
        
          // Save session to localStorage for persistence
          localStorage.setItem('sunride_auth_session', JSON.stringify(newUser));
        } else {
          // Merge MongoDB data (phone, address, isRider) with Google auth data
          const mergedUser: User = {
            ...userData,
            phone: existingUser.phone || '',
            address: existingUser.address || '',
            isRider: existingUser.isRider || false,
            riderApprovedAt: existingUser.riderApprovedAt
          };
          // Update local React state
          setUser(mergedUser);
          console.log('✅ User data merged from MongoDB:', mergedUser);
          console.log('🔄 User data stored in MongoDB:', mergedUser);
          
          // Save session to localStorage for persistence
          localStorage.setItem('sunride_auth_session', JSON.stringify(mergedUser));
        }
      } catch (error) {
        console.error('❌ Error syncing user to MongoDB:', error);
        // Fallback to local state only
        setUser(userData);
        console.log('🔄 User data stored in local state:', userData);
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }, []);

  const updateUserProfile = useCallback(async (profileData: { phone?: string; address?: string }) => {
    if (!user) {
      console.log('❌ No user to update');
      return;
    }
    
    try {
      console.log('🔄 Updating user profile:', { id: user.id, ...profileData });
      
      // Update user in MongoDB
      const updatedUser = await userAPI.update(user.id, profileData);
      
      // Update local React state with the new data
      setUser(prev => {
        const updatedUser = prev ? { ...prev, ...profileData } : null;
        
        // Save updated session to localStorage
        if (updatedUser) {
          localStorage.setItem('sunride_auth_session', JSON.stringify(updatedUser));
        }
        
        return updatedUser;
      });
      
      console.log('✅ User profile updated successfully:', updatedUser);
    } catch (error) {
      console.error('❌ Failed to update user profile:', error);
      throw error;
    }
  }, [user]);

  const syncUser = useCallback(async () => {
    if (!user) {
      console.log('❌ No user to sync');
      return;
    }
    
    console.log('🔄 Syncing user data for:', user.email);
    
    try {
      // Check if user exists in MongoDB
      let existingUser;
      try {
        existingUser = await userAPI.getByEmail(user.email);
        console.log('📋 Found existing user in MongoDB:', existingUser);
      } catch {
        existingUser = null;
        console.log('📋 User not found in MongoDB');
      }

      if (!existingUser) {
        // Create user in MongoDB from Google data
        const newUser = {
          id: user.id,
          googleId: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          phone: user.phone || '',
          address: user.address || '',
          isRider: false,
          createdAt: new Date().toISOString()
        };
        await userAPI.create(newUser);
        console.log('✅ User created in MongoDB during sync:', newUser);
        
        // Update local React state
        setUser(newUser);
      } else {
        // Update existing user with latest data
        const updatedUser = {
          ...existingUser,
          name: user.name,
          picture: user.picture || '',
          phone: user.phone || existingUser.phone || '',
          address: user.address || existingUser.address || ''
        };
        await userAPI.update(user.id, updatedUser);
        console.log('✅ User data synced to MongoDB:', updatedUser);
        
        // Update local React state
        setUser(updatedUser);
        console.log('🔄 User data stored in MongoDB:', updatedUser);
        
        // Save session to localStorage for persistence
        localStorage.setItem('sunride_auth_session', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('❌ Error syncing user:', error);
    }
  }, [user]);

  // Sync user on login
  useEffect(() => {
    if (user && (!user.phone || !user.address || !user.createdAt)) {
      console.log('🔄 User missing required fields, triggering sync...');
      syncUser();
    }
  }, [user, syncUser]);

  // Watch for user changes and update session
  useEffect(() => {
    if (user) {
      console.log('🔄 User state changed, updating session...');
      localStorage.setItem('sunride_auth_session', JSON.stringify(user));
    }
  }, [user]);

  // Initial data fetch on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user session exists in localStorage
        const storedUser = localStorage.getItem('sunride_auth_session');
        console.log('🔍 Checking localStorage for session:', storedUser ? 'Found' : 'Not found');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('🔄 Restoring user session from localStorage:', userData.email);
          setUser(userData);
          
          // Sync with MongoDB to get latest data (but don't overwrite session)
          if (!userData.phone || !userData.address || !userData.createdAt) {
            console.log('🔄 User missing required fields, triggering sync...');
            await syncUser();
          }
        } else {
          console.log('🔄 No session found, initializing fresh...');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      }
    };
    
    initializeAuth();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Clear localStorage session only on explicit logout
    localStorage.removeItem('sunride_auth_session');
    console.log('🔓 User logged out, session cleared');
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
        updateUserProfile,
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
