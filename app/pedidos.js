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
  });
}

export function getPedidos() {
  return listaPedidos;
}

export function getUltimoPedido() {
  return listaPedidos[listaPedidos.length - 1] || null;
}