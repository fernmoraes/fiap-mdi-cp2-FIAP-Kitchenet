import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { login, logout, isAuthenticated } from './auth';

export default function Home() {
  const router = useRouter();
  const [rm, setRm] = useState('');
  const [senha, setSenha] = useState('');
  const [logado, setLogado] = useState(isAuthenticated());

  const entrar = () => {
    if (!rm.trim() || !senha.trim()) {
      alert('Por favor, preencha RM e senha antes de entrar.');
      return;
    }
    // autenticação de teste (não precisa ser real)
    login();
    setLogado(true);
  };

  const deslogar = () => {
    logout();
    setLogado(false);
    setRm('');
    setSenha('');
    router.push('/');
  };

  return (
    <View style={styles.container}>
      {logado ? (
        <View style={styles.loginCard}>
          <Text style={styles.titulo}>Você está logado!</Text>
          <TouchableOpacity style={styles.botao} onPress={() => router.push('/perfil')}>
            <Text style={styles.botaoTexto}>Ir para Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botao, { backgroundColor: '#8C8C8C', marginTop: 12 }]} onPress={deslogar}>
            <Text style={styles.botaoTexto}>Sair</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loginCard}>
          <Text style={styles.titulo}>LOGIN</Text>

          <Text style={styles.label}>RM</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira seu RM"
            placeholderTextColor="#8C8C8C"
            value={rm}
            onChangeText={setRm}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira sua senha"
            placeholderTextColor="#8C8C8C"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.botao} onPress={entrar}>
            <Text style={styles.botaoTexto}>Entrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loginCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#2c2c2c',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F23064',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#8C8C8C',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#404040',
    color: '#fff',
    borderColor: '#8C8C8C',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  botao: {
    backgroundColor: '#F23064',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});