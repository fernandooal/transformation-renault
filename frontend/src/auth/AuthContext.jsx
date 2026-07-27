import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, storage } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(storage.getToken());
  const [user, setUser] = useState(storage.getUser());
  const navigate = useNavigate();

  async function login(username, password) {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    storage.save(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    navigate("/");
  }

  function logout() {
    storage.clear();
    setToken(null);
    setUser(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
