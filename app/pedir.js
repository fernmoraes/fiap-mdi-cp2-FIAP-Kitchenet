import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { adicionarPedido } from './pedidos';

export default function Pedir() {
  const router = useRouter();
  const [carrinho, setCarrinho] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

  const itensPorTipo = {
    Bebidas: [
      { id: '1', nome: 'Refrigerante', preco: 5.00 },
      { id: '2', nome: 'Suco', preco: 4.00 },
      { id: '3', nome: 'Água', preco: 2.00 },
    ],
    Lanches: [
      { id: '4', nome: 'Coxinha', preco: 8.00 },
      { id: '5', nome: 'Esfiha', preco: 10.00 },
      { id: '6', nome: 'Pão de Queijo', preco: 6.00 },
    ],
    Doces: [
      { id: '10', nome: 'Sorvete', preco: 7.00 },
      { id: '11', nome: 'Bolo', preco: 12.00 },
      { id: '12', nome: 'Chocolate', preco: 3.00 },
    ],
  };

  const adicionarAoCarrinho = (item) => {
    const existente = carrinho.find(c => c.item.id === item.id);
    if (existente) {
      existente.quantidade += 1;
      setCarrinho([...carrinho]);
    } else {
      setCarrinho([...carrinho, { item, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (index) => {
    const novoCarrinho = [...carrinho];
    if (novoCarrinho[index].quantidade > 1) {
      novoCarrinho[index].quantidade -= 1;
    } else {
      novoCarrinho.splice(index, 1);
    }
    setCarrinho(novoCarrinho);
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, c) => total + (c.item.preco * c.quantidade), 0);
  };

  const abrirModal = () => {
    setPagamentoConfirmado(false);
    setModalVisivel(true);
  };

  const confirmarPagamento = (metodo) => {
    adicionarPedido(carrinho);
    setPagamentoConfirmado(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    if (pagamentoConfirmado) {
      setCarrinho([]);
    }
  };

  const renderTipo = (tipo, itens) => (
    <View key={tipo} style={styles.tipoContainer}>
      <Text style={styles.tipoTitulo}>{tipo}</Text>
      <View style={styles.itensRow}>
        {itens.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemPreco}>R$ {item.preco.toFixed(2)}</Text>
            <TouchableOpacity style={styles.botaoAdicionar} onPress={() => adicionarAoCarrinho(item)}>
              <Text style={styles.botaoAdicionarTexto}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisivel}
        transparent
        animationType="slide"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {pagamentoConfirmado ? (
              <>
                <Text style={styles.modalTitulo}>Pedido Realizado!</Text>
                <Text style={styles.confirmacaoTexto}>Seu pedido foi confirmado. Aguarde o preparo.</Text>
                <TouchableOpacity style={styles.botaoFechar} onPress={fecharModal}>
                  <Text style={styles.botaoFecharTexto}>OK</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitulo}>Finalizar Pedido</Text>

                <Text style={styles.modalSubtitulo}>Resumo</Text>
                {carrinho.map((c, index) => (
                  <View key={index} style={styles.modalItem}>
                    <Text style={styles.modalItemTexto}>{c.item.nome} (x{c.quantidade})</Text>
                    <Text style={styles.modalItemPreco}>R$ {(c.item.preco * c.quantidade).toFixed(2)}</Text>
                  </View>
                ))}
                <Text style={styles.modalTotal}>Total: R$ {calcularTotal().toFixed(2)}</Text>

                <Text style={styles.modalSubtitulo}>Forma de Pagamento</Text>
                <TouchableOpacity style={styles.botaoPagamento} onPress={() => confirmarPagamento('PIX')}>
                  <Text style={styles.botaoPagamentoTexto}>PIX</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoPagamento} onPress={() => confirmarPagamento('Crédito')}>
                  <Text style={styles.botaoPagamentoTexto}>Cartão de Crédito</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoPagamento} onPress={() => confirmarPagamento('Débito')}>
                  <Text style={styles.botaoPagamentoTexto}>Cartão de Débito</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoCancelar} onPress={fecharModal}>
                  <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.titulo}>Fazer Pedido</Text>

        {Object.entries(itensPorTipo).map(([tipo, itens]) => renderTipo(tipo, itens))}

        <View style={styles.carrinhoContainer}>
          <Text style={styles.carrinhoTitulo}>Carrinho</Text>
          {carrinho.length === 0 ? (
            <Text style={styles.carrinhoVazio}>Nenhum item no carrinho</Text>
          ) : (
            <>
              {carrinho.map((c, index) => (
                <View key={index} style={styles.carrinhoItem}>
                  <Text style={styles.carrinhoItemNome}>{c.item.nome} (x{c.quantidade})</Text>
                  <Text style={styles.carrinhoItemPreco}>R$ {(c.item.preco * c.quantidade).toFixed(2)}</Text>
                  <TouchableOpacity style={styles.botaoRemover} onPress={() => removerDoCarrinho(index)}>
                    <Text style={styles.botaoRemoverTexto}>Remover</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <Text style={styles.total}>Total: R$ {calcularTotal().toFixed(2)}</Text>
              <TouchableOpacity style={styles.botaoFinalizar} onPress={abrirModal}>
                <Text style={styles.botaoFinalizarTexto}>Finalizar Pedido</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#262626' },
  scrollContainer: { padding: 16 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#F23064', textAlign: 'center', marginBottom: 20 },
  tipoContainer: { marginBottom: 20 },
  tipoTitulo: { fontSize: 20, fontWeight: 'bold', color: '#8C8C8C', marginBottom: 10 },
  itensRow: { flexDirection: 'row', justifyContent: 'space-between' },
  item: { backgroundColor: '#404040', padding: 12, borderRadius: 8, marginHorizontal: 4, flex: 1, alignItems: 'center' },
  itemNome: { color: '#fff', fontSize: 14, textAlign: 'center' },
  itemPreco: { color: '#8C8C8C', fontSize: 12, textAlign: 'center', marginVertical: 4 },
  botaoAdicionar: { backgroundColor: '#F23064', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, marginTop: 4 },
  botaoAdicionarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  carrinhoContainer: { marginTop: 20 },
  carrinhoTitulo: { fontSize: 20, fontWeight: 'bold', color: '#F23064', marginBottom: 10 },
  carrinhoVazio: { color: '#8C8C8C', textAlign: 'center', marginBottom: 10 },
  carrinhoItem: { backgroundColor: '#404040', padding: 10, borderRadius: 8, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  carrinhoItemNome: { color: '#fff', fontSize: 14, flex: 1 },
  carrinhoItemPreco: { color: '#8C8C8C', fontSize: 12 },
  botaoRemover: { backgroundColor: '#8C8C8C', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, marginLeft: 10 },
  botaoRemoverTexto: { color: '#fff', fontSize: 12 },
  total: { fontSize: 16, fontWeight: 'bold', color: '#F23064', textAlign: 'center', marginVertical: 10 },
  botaoFinalizar: { backgroundColor: '#F23064', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  botaoFinalizarTexto: { color: '#fff', fontWeight: 'bold' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#262626', borderRadius: 12, padding: 24, width: '90%' },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#F23064', textAlign: 'center', marginBottom: 16 },
  modalSubtitulo: { fontSize: 16, fontWeight: 'bold', color: '#8C8C8C', marginTop: 12, marginBottom: 8 },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  modalItemTexto: { color: '#fff', fontSize: 14 },
  modalItemPreco: { color: '#8C8C8C', fontSize: 14 },
  modalTotal: { fontSize: 16, fontWeight: 'bold', color: '#F23064', textAlign: 'right', marginVertical: 8 },
  botaoPagamento: { backgroundColor: '#404040', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  botaoPagamentoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  botaoCancelar: { paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  botaoCancelarTexto: { color: '#8C8C8C', fontSize: 14 },
  confirmacaoTexto: { color: '#fff', textAlign: 'center', fontSize: 15, marginBottom: 24 },
  botaoFechar: { backgroundColor: '#F23064', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  botaoFecharTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});