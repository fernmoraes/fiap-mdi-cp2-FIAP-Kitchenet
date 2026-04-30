import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@kitchenet_users';
const SESSION_KEY = '@kitchenet_session';

async function getUsers() {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function registrar(nome, email, senha) {
  const users = await getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('Este email já está cadastrado.');
  }
  users.push({ nome, email, senha });
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function login(email, senha) {
  const users = await getUsers();
  const user = users.find(u => u.email === email && u.senha === senha);
  if (!user) throw new Error('Email ou senha incorretos.');
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function verificarSessao() {
  const data = await AsyncStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}
