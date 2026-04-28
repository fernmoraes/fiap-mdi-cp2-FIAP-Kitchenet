import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { isAuthenticated } from './auth';
import { getUltimoPedido } from './pedidos';

export default function Retirada() {
  const router = useRouter();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setPedido(getUltimoPedido());
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Retirada</Text>

      {pedido ? (
        <View style={styles.card}>
          <Text style={styles.label}>Seu código de retirada</Text>
          <Text style={styles.codigo}>{pedido.codigo}</Text>
          <Text style={styles.instrucao}>
            Apresente este código no balcão para retirar seu pedido.
          </Text>

          <View style={styles.divisor} />

          <Text style={styles.resumoTitulo}>Pedido</Text>
          {pedido.itens.map((c, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemNome}>{c.item.nome} x{c.quantidade}</Text>
              <Text style={styles.itemPreco}>R$ {(c.item.preco * c.quantidade).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.divisor} />

          <View style={styles.itemRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValor}>
              R$ {pedido.itens.reduce((acc, c) => acc + c.item.preco * c.quantidade, 0).toFixed(2)}
            </Text>
          </View>

          <Text style={styles.data}>Pedido em {pedido.data}</Text>
        </View>
      ) : (
        <View style={styles.vazioContainer}>
          <Text style={styles.vazioTexto}>Nenhum pedido ativo</Text>
          <Text style={styles.vazioSub}>Faça um pedido na aba Pedir</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#262626', alignItems: 'center', justifyContent: 'center', padding: 16 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#F23064', marginBottom: 24 },
  card: { backgroundColor: '#404040', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center' },
  label: { fontSize: 14, color: '#8C8C8C', marginBottom: 8 },
  codigo: { fontSize: 64, fontWeight: 'bold', color: '#F23064', letterSpacing: 8, marginBottom: 12 },
  instrucao: { fontSize: 14, color: '#8C8C8C', textAlign: 'center', marginBottom: 16 },
  divisor: { width: '100%', height: 1, backgroundColor: '#262626', marginVertical: 12 },
  resumoTitulo: { fontSize: 16, fontWeight: 'bold', color: '#fff', alignSelf: 'flex-start', marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 4 },
  itemNome: { color: '#fff', fontSize: 14 },
  itemPreco: { color: '#8C8C8C', fontSize: 14 },
  totalLabel: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  totalValor: { color: '#F23064', fontWeight: 'bold', fontSize: 15 },
  data: { color: '#8C8C8C', fontSize: 12, marginTop: 12 },
  vazioContainer: { alignItems: 'center' },
  vazioTexto: { color: '#8C8C8C', fontSize: 18, marginBottom: 8 },
  vazioSub: { color: '#404040', fontSize: 14 },
});