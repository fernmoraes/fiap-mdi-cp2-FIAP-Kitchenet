import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function solicitarPermissaoNotificacoes() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function agendarNotificacaoPedidoPronto(codigo, segundos) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pedido pronto! 🍽️',
      body: `Seu pedido #${codigo} está pronto para retirada.`,
    },
    trigger: { type: 'timeInterval', seconds: segundos, repeats: false },
  });
}
