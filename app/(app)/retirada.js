import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { isAuthenticated } from '../auth';
import { getPedidos, getPedidoAtivo, concluirPedido } from '../pedidos';

export default function Retirada() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams();
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [todosPedidos, setTodosPedidos] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/(auth)/');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const todos = [...getPedidos()].reverse();
      setTodosPedidos(todos);

      if (idParam) {
        const encontrado = getPedidos().find(p => p.id === idParam);
        setPedidoSelecionado(encontrado || getPedidoAtivo());
      } else {
        setPedidoSelecionado(getPedidoAtivo());
      }
    }, [idParam])
  );

  const handleConcluir = () => {
    if (!pedidoSelecionado || pedidoSelecionado.status !== 'ativo') return;
    concluirPedido(pedidoSelecionado.id);
    const todos = [...getPedidos()].reverse();
    setTodosPedidos(todos);
    const atualizado = getPedidos().find(p => p.id === pedidoSelecionado.id);
    setPedidoSelecionado({ ...atualizado });
  };

  const selecionarPedido = (item) => {
    setPedidoSelecionado({ ...item });
  };

  const isSelecionado = (item) => pedidoSelecionado?.id === item.id;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.titulo}>Retirada</Text>

      {/* Card do pedido selecionado */}
      {pedidoSelecionado ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.label}>Código de retirada</Text>
            <View style={[styles.statusBadge, pedidoSelecionado.status === 'concluido' ? styles.statusConcluido : styles.statusAtivo]}>
              <Text style={styles.statusTexto}>{pedidoSelecionado.status === 'concluido' ? 'Concluído' : 'Ativo'}</Text>
            </View>
          </View>

          <Text style={styles.codigo}>{pedidoSelecionado.codigo}</Text>

          {pedidoSelecionado.status === 'ativo' && (
            <Text style={styles.instrucao}>
              Apresente este código no balcão para retirar seu pedido.
            </Text>
          )}

          <View style={styles.divisor} />

          <Text style={styles.resumoTitulo}>Pedido</Text>
          {pedidoSelecionado.itens.map((c, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemNome}>{c.item.nome} x{c.quantidade}</Text>
              <Text style={styles.itemPreco}>R$ {(c.item.preco * c.quantidade).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.divisor} />

          <View style={styles.itemRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValor}>
              R$ {pedidoSelecionado.itens.reduce((acc, c) => acc + c.item.preco * c.quantidade, 0).toFixed(2)}
            </Text>
          </View>

          <Text style={styles.data}>Pedido em {pedidoSelecionado.data}</Text>

          {pedidoSelecionado.status === 'ativo' ? (
            <TouchableOpacity style={styles.botaoConcluir} onPress={handleConcluir}>
              <Text style={styles.botaoConcluirTexto}>Concluído</Text>
            </TouchableOpacity>
          ) : (
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

      {/* Histórico clicável */}
      {todosPedidos.length > 0 && (
        <View style={styles.historicoContainer}>
          <Text style={styles.historicoTitulo}>Histórico de Pedidos</Text>
          {todosPedidos.map((item) => {
            const total = item.itens.reduce((acc, c) => acc + c.item.preco * c.quantidade, 0);
            const concluido = item.status === 'concluido';
            const selecionado = isSelecionado(item);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.historicoItem, selecionado && styles.historicoItemSelecionado]}
                onPress={() => selecionarPedido(item)}
                activeOpacity={0.7}
              >
                <View style={styles.historicoLeft}>
                  <Text style={styles.historicoCodigo}>#{item.codigo}</Text>
                  <Text style={styles.historicoNomes}>
                    {item.itens.map(c => c.item.nome).join(', ')}
                  </Text>
                  <Text style={styles.historicoData}>{item.data}</Text>
                </View>
                <View style={styles.historicoRight}>
                  <Text style={styles.historicoTotal}>R$ {total.toFixed(2)}</Text>
                  <View style={[styles.statusBadge, concluido ? styles.statusConcluido : styles.statusAtivo]}>
                    <Text style={styles.statusTexto}>{concluido ? 'Concluído' : 'Ativo'}</Text>
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
  container: { flex: 1, backgroundColor: '#262626' },
  scrollContent: { padding: 16, paddingBottom: 32 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#F23064', marginBottom: 16, textAlign: 'center' },

  // Card
  card: { backgroundColor: '#404040', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center', marginBottom: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 8 },
  label: { fontSize: 14, color: '#8C8C8C' },
  codigo: { fontSize: 56, fontWeight: 'bold', color: '#F23064', letterSpacing: 8, marginBottom: 12 },
  instrucao: { fontSize: 14, color: '#8C8C8C', textAlign: 'center', marginBottom: 16 },
  divisor: { width: '100%', height: 1, backgroundColor: '#262626', marginVertical: 12 },
  resumoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#fff', alignSelf: 'flex-start', marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 4 },
  itemNome: { color: '#fff', fontSize: 14 },
  itemPreco: { color: '#8C8C8C', fontSize: 14 },
  totalLabel: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  totalValor: { color: '#F23064', fontWeight: 'bold', fontSize: 15 },
  data: { color: '#8C8C8C', fontSize: 12, marginTop: 12, marginBottom: 16 },
  botaoConcluir: { backgroundColor: '#4CAF50', paddingVertical: 12, borderRadius: 8, alignItems: 'center', width: '100%' },
  botaoConcluirTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  botaoConcluido: { backgroundColor: '#333', paddingVertical: 12, borderRadius: 8, alignItems: 'center', width: '100%' },
  botaoConcluidoTexto: { color: '#4CAF50', fontWeight: 'bold', fontSize: 15 },

  // Vazio
  vazioContainer: { alignItems: 'center', marginBottom: 24 },
  vazioTexto: { color: '#8C8C8C', fontSize: 18, marginBottom: 8 },
  vazioSub: { color: '#404040', fontSize: 14 },

  // Histórico
  historicoContainer: {},
  historicoTitulo: { fontSize: 18, fontWeight: 'bold', color: '#8C8C8C', marginBottom: 10 },
  historicoItem: { backgroundColor: '#404040', borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  historicoItemSelecionado: { borderColor: '#F23064' },
  historicoLeft: { flex: 1 },
  historicoCodigo: { color: '#F23064', fontWeight: 'bold', fontSize: 13 },
  historicoNomes: { color: '#fff', fontSize: 13, marginTop: 2 },
  historicoData: { color: '#8C8C8C', fontSize: 11, marginTop: 2 },
  historicoRight: { alignItems: 'flex-end', gap: 6 },
  historicoTotal: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  statusAtivo: { backgroundColor: '#F23064' },
  statusConcluido: { backgroundColor: '#4CAF50' },
  statusTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
