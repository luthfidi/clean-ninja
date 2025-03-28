import { AuthClient } from '@dfinity/auth-client';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create context
export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  authClient: null,
  identity: null,
  principal: null,
  isInitializing: true
});

// Auth context hook
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: false,
    authClient: null,
    identity: null,
    principal: null,
    isInitializing: true,
    error: null
  });

  // Initialize AuthClient
  useEffect(() => {
    const init = async () => {
      try {
        const client = await AuthClient.create();
        const isLoggedIn = await client.isAuthenticated();
        
        setState(prev => ({
          ...prev,
          authClient: client,
          isAuthenticated: isLoggedIn,
          identity: isLoggedIn ? client.getIdentity() : null,
          principal: isLoggedIn ? client.getIdentity().getPrincipal().toString() : null,
          isInitializing: false
        }));
      } catch (error) {
        console.error("Auth initialization error:", error);
        setState(prev => ({ ...prev, error: error.message, isInitializing: false }));
      }
    };
    
    init();
  }, []);

  // Login function
  const login = async () => {
    if (!state.authClient) return;
    
    try {
      // Get identity provider URL
      const dfxNetwork = process.env.DFX_NETWORK || window.process?.env?.DFX_NETWORK;
      const iiCanisterId = process.env.CANISTER_ID_INTERNET_IDENTITY || 
                          window.process?.env?.CANISTER_ID_INTERNET_IDENTITY || 
                          'rdmx6-jaaaa-aaaaa-aaadq-cai';
      
      const identityProviderUrl = dfxNetwork === 'ic' 
        ? 'https://identity.ic0.app' 
        : `http://localhost:8000?canisterId=${iiCanisterId}`;
      
      return new Promise((resolve, reject) => {
        state.authClient.login({
          identityProvider: identityProviderUrl,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
          onSuccess: () => {
            const identity = state.authClient.getIdentity();
            setState(prev => ({
              ...prev,
              isAuthenticated: true,
              identity,
              principal: identity.getPrincipal().toString()
            }));
            resolve();
          },
          onError: error => reject(error)
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  // Logout function
  const logout = async () => {
    if (!state.authClient) return;
    
    try {
      await state.authClient.logout();
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        identity: null,
        principal: null
      }));
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout state even if there's an error
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        identity: null,
        principal: null,
        error: error.message
      }));
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: state.isAuthenticated, 
        login, 
        logout, 
        authClient: state.authClient, 
        identity: state.identity,
        principal: state.principal,
        isInitializing: state.isInitializing,
        error: state.error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};