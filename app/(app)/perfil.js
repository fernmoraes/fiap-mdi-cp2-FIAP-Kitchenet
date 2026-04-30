import { useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Switch,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { useTheme } from "../context/ThemeContext";

export default function Perfil() {
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const { pedidos, recarregarPedidos } = useAppData();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useFocusEffect(
    useCallback(() => {
      recarregarPedidos();
    }, []),
  );

  const deslogar = async () => {
    await logout();
    router.replace("/(auth)/");
  };

  const renderPedido = ({ item }) => {
    const resumo = item.itens.map((c) => c.item.nome).join(", ");
    const total = item.itens.reduce(
      (acc, c) => acc + c.item.preco * c.quantidade,
      0,
    );
    const concluido = item.status === "concluido";
    return (
      <TouchableOpacity
        style={styles.pedidoItem}
        onPress={() =>
          router.push({ pathname: "/(app)/retirada", params: { id: item.id } })
        }
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.pedidoNome}>{resumo}</Text>
          <Text style={styles.pedidoData}>{item.data}</Text>
        </View>
        <View style={styles.pedidoRight}>
          <Text style={styles.pedidoValor}>R$ {total.toFixed(2)}</Text>
          <View
            style={[
              styles.statusBadge,
              concluido ? styles.statusConcluido : styles.statusAtivo,
            ]}
          >
            <Text style={styles.statusTexto}>
              {concluido ? "Concluído" : "Ativo"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil</Text>

      {usuario && (
        <Text style={styles.nomeUsuario}>
          Olá, {usuario.nome.split(" ")[0]}!
        </Text>
      )}

      <View style={styles.pedidosContainer}>
        <Text style={styles.pedidosTitulo}>Pedidos Feitos</Text>
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={renderPedido}
          style={styles.pedidosList}
          ListEmptyComponent={
            <Text style={styles.semPedidos}>Nenhum pedido realizado</Text>
          }
        />
      </View>

      <TouchableOpacity
        style={styles.botaoPedir}
        onPress={() => router.push("/pedir")}
      >
        <Text style={styles.botaoPedirTexto}>Pedir</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <View style={styles.temaContainer}>
        <Text style={styles.temaLabel}>
          {isDark ? "Tema Escuro" : "Tema Claro"}
        </Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      <TouchableOpacity style={styles.botaoDeslogar} onPress={deslogar}>
        <Text style={styles.botaoDeslogarTexto}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.background,
      padding: 16,
    },
    titulo: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 4,
      color: c.primary,
    },
    nomeUsuario: { fontSize: 15, color: c.textSecondary, marginBottom: 20 },
    pedidosContainer: { width: "100%", marginBottom: 20 },
    pedidosTitulo: {
      fontSize: 20,
      fontWeight: "bold",
      color: c.primary,
      marginBottom: 10,
    },
    pedidosList: { maxHeight: 260 },
    pedidoItem: {
      backgroundColor: c.surface,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: 2,
    },
    pedidoNome: { color: c.text, fontSize: 14 },
    pedidoData: { color: c.textSecondary, fontSize: 12, marginTop: 2 },
    pedidoRight: { alignItems: "flex-end", gap: 6 },
    pedidoValor: { color: c.primary, fontSize: 14, fontWeight: "bold" },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
    statusAtivo: { backgroundColor: c.primary },
    statusConcluido: { backgroundColor: "#4CAF50" },
    statusTexto: { color: "#fff", fontSize: 11, fontWeight: "bold" },
    semPedidos: { color: c.textSecondary, textAlign: "center", marginTop: 10 },
    temaContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 4,
      marginBottom: 8,
    },
    temaLabel: { fontSize: 16, color: c.text },
    botaoDeslogar: {
      backgroundColor: c.disabled,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      width: "100%",
      marginTop: 4,
    },
    botaoDeslogarTexto: { color: "#fff", fontWeight: "bold" },
    botaoPedir: {
      backgroundColor: c.primary,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 12,
    },
    botaoPedirTexto: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  });
