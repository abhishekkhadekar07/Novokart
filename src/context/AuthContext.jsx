import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Auth } from "../lib/db.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await Auth.ensureDemo();
      setUser(Auth.currentUser());
      setReady(true);
    })();
  }, []);

  const refresh = useCallback(() => setUser(Auth.currentUser()), []);

  const login = useCallback(async (email, password) => {
    const u = await Auth.login(email, password);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (payload) => {
    const u = await Auth.signup(payload);
    setUser(u);
    return u;
  }, []);

  const demoLogin = useCallback(async () => {
    await Auth.ensureDemo();
    return login("demo@novakart.in", "Demo@123");
  }, [login]);

  const updateUser = useCallback((patch) => {
    Auth.updateUser(patch);
    setUser(Auth.currentUser());
  }, []);

  const logout = useCallback(() => {
    Auth.logout();
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, ready, refresh, login, signup, demoLogin, updateUser, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
