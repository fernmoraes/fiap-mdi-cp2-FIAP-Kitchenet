import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';

let Notifications = null;

if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch {
    Notifications = null;
  }
}

export async function solicitarPermissaoNotificacoes() {
  if (!Notifications) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function agendarNotificacaoPedidoPronto(codigo, segundos) {
  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pedido pronto! 🍽️',
        body: `Seu pedido #${codigo} está pronto para retirada.`,
      },
      trigger: { type: 'timeInterval', seconds: segundos, repeats: false },
    });
  } catch {
    // Notificações não disponíveis neste ambiente
  }
}
