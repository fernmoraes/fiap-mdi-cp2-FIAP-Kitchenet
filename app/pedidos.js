import AsyncStorage from '@react-native-async-storage/async-storage';

const PEDIDOS_KEY = '@kitchenet_pedidos';

function gerarCodigo() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function lerPedidos() {
  const data = await AsyncStorage.getItem(PEDIDOS_KEY);
  return data ? JSON.parse(data) : [];
}

async function salvarPedidos(pedidos) {
  await AsyncStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
}

export async function adicionarPedido(itens) {
  const pedidos = await lerPedidos();
  pedidos.push({
    id: String(Date.now()),
    codigo: gerarCodigo(),
    itens,
    data: new Date().toLocaleDateString('pt-BR'),
    status: 'ativo',
  });
  await salvarPedidos(pedidos);
}

export async function concluirPedido(id) {
  const pedidos = await lerPedidos();
  const pedido = pedidos.find(p => p.id === id);
  if (pedido) {
    pedido.status = 'concluido';
    await salvarPedidos(pedidos);
  }
}

export async function getPedidos() {
  return lerPedidos();
}

export async function getPedidoAtivo() {
  const pedidos = await lerPedidos();
  return [...pedidos].reverse().find(p => p.status === 'ativo') || null;
}
