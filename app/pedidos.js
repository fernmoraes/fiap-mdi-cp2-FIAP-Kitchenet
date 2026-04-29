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

async function atualizarPreparando(pedidos) {
  const agora = Date.now();
  let mudou = false;
  pedidos.forEach(p => {
    if (p.status === 'preparando' && p.preparandoAte && agora >= p.preparandoAte) {
      p.status = 'ativo';
      mudou = true;
    }
  });
  if (mudou) await salvarPedidos(pedidos);
  return pedidos;
}

export async function adicionarPedido(itens) {
  const pedidos = await lerPedidos();
  pedidos.push({
    id: String(Date.now()),
    codigo: gerarCodigo(),
    itens,
    data: new Date().toLocaleDateString('pt-BR'),
    status: 'preparando',
    preparandoAte: Date.now() + 15000,
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
  const pedidos = await lerPedidos();
  return atualizarPreparando(pedidos);
}
