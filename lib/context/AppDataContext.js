import { createContext, useContext, useState, useCallback } from "react";
import {
  getPedidos,
  adicionarPedido as addPedido,
  concluirPedido as concludePedido,
} from "../pedidos";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [pedidos, setPedidos] = useState([]);

  const recarregarPedidos = useCallback(async () => {
    const lista = await getPedidos();
    const reversed = [...lista].reverse();
    setPedidos(reversed);
    return reversed;
  }, []);

  const adicionarPedido = async (itens) => {
    await addPedido(itens);
    return recarregarPedidos();
  };

  const concluirPedido = async (id) => {
    await concludePedido(id);
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
