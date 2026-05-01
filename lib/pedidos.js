import AsyncStorage from '@react-native-async-storage/async-storage';
import { agendarNotificacaoPedidoPronto } from './notifications';

function pedidosKey(userEmail) {
  return `@kitchenet_pedidos_${userEmail}`;
}

function gerarCodigo() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function lerPedidos(userEmail) {
  const data = await AsyncStorage.getItem(pedidosKey(userEmail));
  return data ? JSON.parse(data) : [];
}

async function salvarPedidos(userEmail, pedidos) {
  await AsyncStorage.setItem(pedidosKey(userEmail), JSON.stringify(pedidos));
}

async function atualizarPreparando(userEmail, pedidos) {
  const agora = Date.now();
  let mudou = false;
  pedidos.forEach(p => {
    if (p.status === 'preparando' && p.preparandoAte && agora >= p.preparandoAte) {
      p.status = 'ativo';
      mudou = true;
    }
  });
  if (mudou) await salvarPedidos(userEmail, pedidos);
  return pedidos;
}

export async function adicionarPedido(userEmail, itens) {
  const pedidos = await lerPedidos(userEmail);
  const codigo = gerarCodigo();
  const tempoPreparacao = 15;
  pedidos.push({
    id: String(Date.now()),
    codigo,
    itens,
    data: new Date().toLocaleDateString('pt-BR'),
    status: 'preparando',
    preparandoAte: Date.now() + tempoPreparacao * 1000,
  });
  await salvarPedidos(userEmail, pedidos);
  await agendarNotificacaoPedidoPronto(codigo, tempoPreparacao);
}

export async function concluirPedido(userEmail, id) {
  const pedidos = await lerPedidos(userEmail);
  const pedido = pedidos.find(p => p.id === id);
  if (pedido) {
    pedido.status = 'concluido';
    await salvarPedidos(userEmail, pedidos);
  }
}

export async function getPedidos(userEmail) {
  const pedidos = await lerPedidos(userEmail);
  return atualizarPreparando(userEmail, pedidos);
}
