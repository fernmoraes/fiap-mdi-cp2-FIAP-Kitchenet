import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppData } from "../context/AppDataContext";
import { useTheme } from "../context/ThemeContext";

export default function Pedir() {
  const router = useRouter();
  const { adicionarPedido } = useAppData();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [carrinho, setCarrinho] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

  const itensPorTipo = {
    Bebidas: [
      {
        id: "1",
        nome: "Refrigerante",
        preco: 5.0,
        imagem: require("../../assets/fotoscardapio/refrigerante.jpg"),
      },
      {
        id: "2",
        nome: "Suco",
        preco: 4.0,
        imagem: require("../../assets/fotoscardapio/suco.jpg"),
      },
      {
        id: "3",
        nome: "Água",
        preco: 2.0,
        imagem: require("../../assets/fotoscardapio/agua.jpg"),
      },
    ],
    Lanches: [
      {
        id: "4",
        nome: "Coxinha",
        preco: 8.0,
        imagem: require("../../assets/fotoscardapio/coxinha.jpg"),
      },
      {
        id: "5",
        nome: "Esfiha",
        preco: 10.0,
        imagem: require("../../assets/fotoscardapio/esfiha.jpg"),
      },
      {
        id: "6",
        nome: "Pão de Queijo",
        preco: 6.0,
        imagem: require("../../assets/fotoscardapio/paodequeijo.jpg"),
      },
    ],
    Doces: [
      {
        id: "10",
        nome: "Sorvete",
        preco: 7.0,
        imagem: require("../../assets/fotoscardapio/sorvete.jpg"),
      },
      {
        id: "11",
        nome: "Bolo",
        preco: 12.0,
        imagem: require("../../assets/fotoscardapio/bolo.jpg"),
      },
      {
        id: "12",
        nome: "Chocolate",
        preco: 3.0,
        imagem: require("../../assets/fotoscardapio/chocolate.jpg"),
      },
    ],
  };

  const adicionarAoCarrinho = (item) => {
    const existente = carrinho.find((c) => c.item.id === item.id);
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
    return carrinho.reduce(
      (total, c) => total + c.item.preco * c.quantidade,
      0,
    );
  };

  const abrirModal = () => {
    setPagamentoConfirmado(false);
    setModalVisivel(true);
  };

  const confirmarPagamento = async () => {
    await adicionarPedido(carrinho);
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
            <Image
              source={item.imagem}
              style={styles.itemImagem}
              resizeMode="cover"
            />
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemPreco}>R$ {item.preco.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.botaoAdicionar}
              onPress={() => adicionarAoCarrinho(item)}
            >
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
                <Text style={styles.confirmacaoTexto}>
                  Seu pedido foi confirmado. Aguarde o preparo.
                </Text>
                <TouchableOpacity
                  style={styles.botaoFechar}
                  onPress={fecharModal}
                >
                  <Text style={styles.botaoFecharTexto}>OK</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitulo}>Finalizar Pedido</Text>

                <Text style={styles.modalSubtitulo}>Resumo</Text>
                {carrinho.map((c, index) => (
                  <View key={index} style={styles.modalItem}>
                    <Text style={styles.modalItemTexto}>
                      {c.item.nome} (x{c.quantidade})
                    </Text>
                    <Text style={styles.modalItemPreco}>
                      R$ {(c.item.preco * c.quantidade).toFixed(2)}
                    </Text>
                  </View>
                ))}
                <Text style={styles.modalTotal}>
                  Total: R$ {calcularTotal().toFixed(2)}
                </Text>

                <Text style={styles.modalSubtitulo}>Forma de Pagamento</Text>
                <TouchableOpacity
                  style={styles.botaoPagamento}
                  onPress={() => confirmarPagamento("PIX")}
                >
                  <Text style={styles.botaoPagamentoTexto}>PIX</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botaoPagamento}
                  onPress={() => confirmarPagamento("Crédito")}
                >
                  <Text style={styles.botaoPagamentoTexto}>
                    Cartão de Crédito
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botaoPagamento}
                  onPress={() => confirmarPagamento("Débito")}
                >
                  <Text style={styles.botaoPagamentoTexto}>
                    Cartão de Débito
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoCancelar}
                  onPress={fecharModal}
                >
                  <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.titulo}>Fazer Pedido</Text>

        {Object.entries(itensPorTipo).map(([tipo, itens]) =>
          renderTipo(tipo, itens),
        )}

        <View style={styles.carrinhoContainer}>
          <Text style={styles.carrinhoTitulo}>Carrinho</Text>
          {carrinho.length === 0 ? (
            <Text style={styles.carrinhoVazio}>Nenhum item no carrinho</Text>
          ) : (
            <>
              {carrinho.map((c, index) => (
                <View key={index} style={styles.carrinhoItem}>
                  <Text style={styles.carrinhoItemNome}>
                    {c.item.nome} (x{c.quantidade})
                  </Text>
                  <Text style={styles.carrinhoItemPreco}>
                    R$ {(c.item.preco * c.quantidade).toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.botaoRemover}
                    onPress={() => removerDoCarrinho(index)}
                  >
                    <Text style={styles.botaoRemoverTexto}>Remover</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <Text style={styles.total}>
                Total: R$ {calcularTotal().toFixed(2)}
              </Text>
              <TouchableOpacity
                style={styles.botaoFinalizar}
                onPress={abrirModal}
              >
                <Text style={styles.botaoFinalizarTexto}>Finalizar Pedido</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    scrollContainer: { padding: 16 },
    titulo: {
      fontSize: 28,
      fontWeight: "bold",
      color: c.primary,
      textAlign: "center",
      marginBottom: 20,
    },
    tipoContainer: { marginBottom: 20 },
    tipoTitulo: {
      fontSize: 20,
      fontWeight: "bold",
      color: c.textSecondary,
      marginBottom: 10,
    },
    itensRow: { flexDirection: "row", justifyContent: "space-between" },
    item: {
      backgroundColor: c.surface,
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 4,
      flex: 1,
      alignItems: "center",
      elevation: 2,
    },
    itemImagem: { width: "100%", height: 80, borderRadius: 6, marginBottom: 8 },
    itemNome: { color: c.text, fontSize: 14, textAlign: "center" },
    itemPreco: {
      color: c.textSecondary,
      fontSize: 12,
      textAlign: "center",
      marginVertical: 4,
    },
    botaoAdicionar: {
      backgroundColor: c.primary,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 6,
      marginTop: 4,
    },
    botaoAdicionarTexto: { color: "#fff", fontWeight: "bold", fontSize: 12 },
    carrinhoContainer: { marginTop: 20 },
    carrinhoTitulo: {
      fontSize: 20,
      fontWeight: "bold",
      color: c.primary,
      marginBottom: 10,
    },
    carrinhoVazio: { color: c.textSecondary, textAlign: "center", marginBottom: 10 },
    carrinhoItem: {
      backgroundColor: c.surface,
      padding: 10,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      elevation: 2,
    },
    carrinhoItemNome: { color: c.text, fontSize: 14, flex: 1 },
    carrinhoItemPreco: { color: c.textSecondary, fontSize: 12 },
    botaoRemover: {
      backgroundColor: c.disabled,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
      marginLeft: 10,
    },
    botaoRemoverTexto: { color: "#fff", fontSize: 12 },
    total: {
      fontSize: 16,
      fontWeight: "bold",
      color: c.primary,
      textAlign: "center",
      marginVertical: 10,
    },
    botaoFinalizar: {
      backgroundColor: c.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    botaoFinalizarTexto: { color: "#fff", fontWeight: "bold" },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: c.card,
      borderRadius: 12,
      padding: 24,
      width: "90%",
      elevation: 8,
    },
    modalTitulo: {
      fontSize: 22,
      fontWeight: "bold",
      color: c.primary,
      textAlign: "center",
      marginBottom: 16,
    },
    modalSubtitulo: {
      fontSize: 16,
      fontWeight: "bold",
      color: c.textSecondary,
      marginTop: 12,
      marginBottom: 8,
    },
    modalItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    modalItemTexto: { color: c.text, fontSize: 14 },
    modalItemPreco: { color: c.textSecondary, fontSize: 14 },
    modalTotal: {
      fontSize: 16,
      fontWeight: "bold",
      color: c.primary,
      textAlign: "right",
      marginVertical: 8,
    },
    botaoPagamento: {
      backgroundColor: c.paymentButton,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 8,
    },
    botaoPagamentoTexto: { color: c.paymentButtonText, fontWeight: "bold", fontSize: 15 },
    botaoCancelar: { paddingVertical: 10, alignItems: "center", marginTop: 4 },
    botaoCancelarTexto: { color: c.textSecondary, fontSize: 14 },
    confirmacaoTexto: {
      color: c.text,
      textAlign: "center",
      fontSize: 15,
      marginBottom: 24,
    },
    botaoFechar: {
      backgroundColor: c.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    botaoFecharTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  });
