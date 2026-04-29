import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const entrar = async () => {
    setErro('');
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha o email e a senha.');
      return;
    }
    setCarregando(true);
    try {
      await login(email.trim().toLowerCase(), senha);
      router.replace('/(app)/perfil');
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>LOGIN</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="rm000000@fiap.com.br"
          placeholderTextColor="#8C8C8C"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#8C8C8C"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity style={styles.botao} onPress={entrar} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botaoTexto}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRegistro} onPress={() => router.push('/(auth)/registro')}>
          <Text style={styles.linkTexto}>Não tem conta? <Text style={styles.linkDestaque}>Criar conta</Text></Text>
        </TouchableOpacity>
      </View>
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
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#2c2c2c',
    borderRadius: 16,
    padding: 24,
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
  erro: {
    color: '#F23064',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
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
  linkRegistro: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkTexto: {
    color: '#8C8C8C',
    fontSize: 14,
  },
  linkDestaque: {
    color: '#F23064',
    fontWeight: 'bold',
  },
});
