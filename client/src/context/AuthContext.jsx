import { createContext, useContext, useState } from 'react';
export const AuthContext = createContext(null);
export function AuthProvider({ children }) { const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('resolveai-auth') || 'null')); const login = value => { setSession(value); localStorage.setItem('resolveai-auth', JSON.stringify(value)); }; const logout = () => { setSession(null); localStorage.removeItem('resolveai-auth'); }; return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>; }
export const useAuthContext = () => useContext(AuthContext);
