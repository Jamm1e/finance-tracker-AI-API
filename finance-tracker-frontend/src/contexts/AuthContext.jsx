// src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { auth, db, initializeAuth } from '../firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

// Create the context that holds the authentication and database services
export const AuthContext = createContext();

// AuthProvider is a component that wraps your entire application
// and makes the AuthContext value available to all child components.
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Initialize Firebase Auth when the component first mounts.
    // This handles signing in anonymously or with a custom token.
    initializeAuth();

    // The onAuthStateChanged listener is a crucial part of Firebase Auth.
    // It runs whenever a user signs in or out, updating our state.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // We set the userId to the authenticated user's UID.
      // If the user is null, we can't get a UID, so we set userId to null as well.
      setUserId(user ? user.uid : null);
      setLoading(false);
    });

    // Clean up the subscription when the component unmounts.
    return unsubscribe;
  }, []);

  // The value object contains all the state and services we want to provide
  // to our application components via the context.
  const value = {
    currentUser,
    userId,
    auth,
    db
  };

  return (
    // We only render the children once the authentication state has been determined.
    // This prevents components from trying to fetch data before a userId exists.
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
