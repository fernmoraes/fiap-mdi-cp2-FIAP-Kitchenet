import { createContext, useContext, useState, useCallback } from "react";
import {
  getPedidos,
  adicionarPedido as addPedido,
  concluirPedido as concludePedido,
} from "../pedidos";
import { useAuth } from "./AuthContext";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);

  const recarregarPedidos = useCallback(async () => {
    if (!usuario?.email) return [];
    const lista = await getPedidos(usuario.email);
    const reversed = [...lista].reverse();
    setPedidos(reversed);
    return reversed;
  }, [usuario?.email]);

  const adicionarPedido = async (itens) => {
    if (!usuario?.email) return;
    await addPedido(usuario.email, itens);
    return recarregarPedidos();
  };

  const concluirPedido = async (id) => {
    if (!usuario?.email) return;
    await concludePedido(usuario.email, id);
    return recarregarPedidos();
  };

  return (
    <AppDataContext.Provider
      value={{ pedidos, recarregarPedidos, adicionarPedido, concluirPedido }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
