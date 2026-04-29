let listaPedidos = [];

function gerarCodigo() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function adicionarPedido(itens) {
  listaPedidos.push({
    id: String(Date.now()),
    codigo: gerarCodigo(),
    itens,
    data: new Date().toLocaleDateString('pt-BR'),
    status: 'ativo',
  });
}

export function concluirPedido(id) {
  const pedido = listaPedidos.find(p => p.id === id);
  if (pedido) pedido.status = 'concluido';
}

export function getPedidos() {
  return listaPedidos;
}

export function getPedidoAtivo() {
  return [...listaPedidos].reverse().find(p => p.status === 'ativo') || null;
}
