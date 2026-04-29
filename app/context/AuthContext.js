import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginStorage,
  logout as logoutStorage,
  verificarSessao,
} from "../auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    verificarSessao().then((user) => {
      setUsuario(user);
      setCarregando(false);
    });
  }, []);

  const login = async (email, senha) => {
    const user = await loginStorage(email, senha);
    setUsuario(user);
    return user;
  };

  const logout = async () => {
    await logoutStorage();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
