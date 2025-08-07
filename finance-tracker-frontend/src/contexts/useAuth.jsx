// src/contexts/useAuth.jsx
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// This custom hook provides a cleaner way to access the AuthContext.
// Any component can import and use `useAuth()` to get the current user,
// userId, and Firebase service instances.
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Add a check to ensure the hook is used inside an AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
