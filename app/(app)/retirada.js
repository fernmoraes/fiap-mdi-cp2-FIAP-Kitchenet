import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useAppData } from "../context/AppDataContext";

export default function Retirada() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams();
  const { pedidos, recarregarPedidos, concluirPedido } = useAppData();
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [segundosRestantes, setSegundosRestantes] = useState(null);

  useFocusEffect(
    useCallback(() => {
      recarregarPedidos().then((lista) => {
        if (idParam) {
          const encontrado = lista.find((p) => p.id === idParam);
          setPedidoSelecionado(
            encontrado || lista.find((p) => p.status !== "concluido") || null
          );
        } else {
          setPedidoSelecionado(
            lista.find((p) => p.status !== "concluido") || null
          );
        }
      });
    }, [idParam])
  );

  // Countdown para pedidos em "preparando"
  useEffect(() => {
    if (!pedidoSelecionado || pedidoSelecionado.status !== "preparando") {
      setSegundosRestantes(null);
      return;
    }

    const calcular = () => {
      const restante = Math.max(
        0,
        Math.ceil((pedidoSelecionado.preparandoAte - Date.now()) / 1000)
      );
      setSegundosRestantes(restante);

      if (restante === 0) {
        recarregarPedidos().then((lista) => {
          const atualizado = lista.find((p) => p.id === pedidoSelecionado.id);
          if (atualizado) setPedidoSelecionado({ ...atualizado });
        });
      }
    };

    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [pedidoSelecionado?.id, pedidoSelecionado?.status]);

  const handleConcluir = async () => {
    if (!pedidoSelecionado || pedidoSelecionado.status !== "ativo") return;
    const lista = await concluirPedido(pedidoSelecionado.id);
    const atualizado = lista.find((p) => p.id === pedidoSelecionado.id);
    setPedidoSelecionado({ ...atualizado });
  };

  const isSelecionado = (item) => pedidoSelecionado?.id === item.id;

  const badgeStyle = (status) => {
    if (status === "preparando") return styles.statusPreparando;
    if (status === "ativo") return styles.statusAtivo;
    return styles.statusConcluido;
  };

  const badgeTexto = (status) => {
    if (status === "preparando") return "Preparando";
    if (status === "ativo") return "Pronto";
    return "Concluído";
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.titulo}>Retirada</Text>

      {pedidoSelecionado ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.label}>
              {pedidoSelecionado.status === "preparando"
                ? "Pedido em preparo"
                : "Código de retirada"}
            </Text>
            <View style={[styles.statusBadge, badgeStyle(pedidoSelecionado.status)]}>
              <Text style={styles.statusTexto}>
                {badgeTexto(pedidoSelecionado.status)}
              </Text>
            </View>
          </View>

          {pedidoSelecionado.status === "preparando" ? (
            <View style={styles.preparandoContainer}>
              <Text style={styles.preparandoTimer}>{segundosRestantes}s</Text>
              <Text style={styles.preparandoTexto}>
                Seu pedido está sendo preparado...
              </Text>
            </View>
          ) : (
            <Text style={styles.codigo}>{pedidoSelecionado.codigo}</Text>
          )}

          {pedidoSelecionado.status === "ativo" && (
            <Text style={styles.instrucao}>
              Apresente este código no balcão para retirar seu pedido.
            </Text>
          )}

          <View style={styles.divisor} />

          <Text style={styles.resumoTitulo}>Pedido</Text>
          {pedidoSelecionado.itens.map((c, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemNome}>
                {c.item.nome} x{c.quantidade}
              </Text>
              <Text style={styles.itemPreco}>
                R$ {(c.item.preco * c.quantidade).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.divisor} />

          <View style={styles.itemRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValor}>
              R${" "}
              {pedidoSelecionado.itens
                .reduce((acc, c) => acc + c.item.preco * c.quantidade, 0)
                .toFixed(2)}
            </Text>
          </View>

          <Text style={styles.data}>Pedido em {pedidoSelecionado.data}</Text>

          {pedidoSelecionado.status === "preparando" && (
            <View style={styles.botaoAguardar}>
              <Text style={styles.botaoAguardarTexto}>
                Aguarde o preparo...
              </Text>
            </View>
          )}

          {pedidoSelecionado.status === "ativo" && (
            <TouchableOpacity style={styles.botaoConcluir} onPress={handleConcluir}>
              <Text style={styles.botaoConcluirTexto}>Concluído</Text>
            </TouchableOpacity>
          )}

          {pedidoSelecionado.status === "concluido" && (
            <View style={styles.botaoConcluido}>
              <Text style={styles.botaoConcluidoTexto}>Pedido Concluído</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.vazioContainer}>
          <Text style={styles.vazioTexto}>Nenhum pedido ativo</Text>
          <Text style={styles.vazioSub}>Faça um pedido na aba Pedir</Text>
        </View>
      )}

      {pedidos.length > 0 && (
        <View style={styles.historicoContainer}>
          <Text style={styles.historicoTitulo}>Histórico de Pedidos</Text>
          {pedidos.map((item) => {
            const total = item.itens.reduce(
              (acc, c) => acc + c.item.preco * c.quantidade,
              0
            );
            const selecionado = isSelecionado(item);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.historicoItem,
                  selecionado && styles.historicoItemSelecionado,
                ]}
                onPress={() => setPedidoSelecionado({ ...item })}
                activeOpacity={0.7}
              >
                <View style={styles.historicoLeft}>
                  <Text style={styles.historicoCodigo}>#{item.codigo}</Text>
                  <Text style={styles.historicoNomes}>
                    {item.itens.map((c) => c.item.nome).join(", ")}
                  </Text>
                  <Text style={styles.historicoData}>{item.data}</Text>
                </View>
                <View style={styles.historicoRight}>
                  <Text style={styles.historicoTotal}>
                    R$ {total.toFixed(2)}
                  </Text>
                  <View style={[styles.statusBadge, badgeStyle(item.status)]}>
                    <Text style={styles.statusTexto}>
                      {badgeTexto(item.status)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#262626" },
  scrollContent: { padding: 16, paddingBottom: 32 },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F23064",
    marginBottom: 16,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#404040",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  label: { fontSize: 14, color: "#8C8C8C" },

  // Preparando
  preparandoContainer: { alignItems: "center", marginVertical: 12 },
  preparandoTimer: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#FF9800",
    letterSpacing: 2,
  },
  preparandoTexto: {
    fontSize: 14,
    color: "#8C8C8C",
    marginTop: 4,
    textAlign: "center",
  },

  codigo: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#F23064",
    letterSpacing: 8,
    marginBottom: 12,
  },
  instrucao: {
    fontSize: 14,
    color: "#8C8C8C",
    textAlign: "center",
    marginBottom: 16,
  },
  divisor: {
    width: "100%",
    height: 1,
    backgroundColor: "#262626",
    marginVertical: 12,
  },
  resumoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 4,
  },
  itemNome: { color: "#fff", fontSize: 14 },
  itemPreco: { color: "#8C8C8C", fontSize: 14 },
  totalLabel: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  totalValor: { color: "#F23064", fontWeight: "bold", fontSize: 15 },
  data: { color: "#8C8C8C", fontSize: 12, marginTop: 12, marginBottom: 16 },

  botaoAguardar: {
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  botaoAguardarTexto: { color: "#FF9800", fontWeight: "bold", fontSize: 15 },
  botaoConcluir: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  botaoConcluirTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  botaoConcluido: {
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  botaoConcluidoTexto: { color: "#8C8C8C", fontWeight: "bold", fontSize: 15 },

  vazioContainer: { alignItems: "center", marginBottom: 24 },
  vazioTexto: { color: "#8C8C8C", fontSize: 18, marginBottom: 8 },
  vazioSub: { color: "#404040", fontSize: 14 },

  historicoContainer: {},
  historicoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8C8C8C",
    marginBottom: 10,
  },
  historicoItem: {
    backgroundColor: "#404040",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  historicoItemSelecionado: { borderColor: "#F23064" },
  historicoLeft: { flex: 1 },
  historicoCodigo: { color: "#F23064", fontWeight: "bold", fontSize: 13 },
  historicoNomes: { color: "#fff", fontSize: 13, marginTop: 2 },
  historicoData: { color: "#8C8C8C", fontSize: 11, marginTop: 2 },
  historicoRight: { alignItems: "flex-end", gap: 6 },
  historicoTotal: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  statusPreparando: { backgroundColor: "#FF9800" },
  statusAtivo: { backgroundColor: "#4CAF50" },
  statusConcluido: { backgroundColor: "#8C8C8C" },
  statusTexto: { color: "#fff", fontSize: 11, fontWeight: "bold" },
});
