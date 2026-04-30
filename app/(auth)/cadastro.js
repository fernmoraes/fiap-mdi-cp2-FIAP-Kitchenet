import { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { registrar } from '../auth';
import { useTheme } from '../context/ThemeContext';

const EMAIL_REGEX = /^rm\d+@fiap\.com\.br$/;

export default function Cadastro() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const validar = () => {
    if (!nome.trim()) return 'Informe seu nome completo.';
    if (nome.trim().split(' ').filter(Boolean).length < 2)
      return 'Informe nome e sobrenome.';
    if (!EMAIL_REGEX.test(email.trim().toLowerCase()))
      return 'Email inválido. Use o formato rm000000@fiap.com.br';
    if (senha.length < 6)
      return 'A senha deve ter no mínimo 6 caracteres.';
    if (senha !== confirmar)
      return 'As senhas não coincidem.';
    return null;
  };

  const cadastrar = async () => {
    setErro('');
    const erroValidacao = validar();
    if (erroValidacao) { setErro(erroValidacao); return; }

    setCarregando(true);
    try {
      await registrar(nome.trim(), email.trim().toLowerCase(), senha);
      router.replace('/(auth)/login');
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  };

  const senhasIncompativeis = confirmar.length > 0 && senha !== confirmar;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.titulo}>CRIAR CONTA</Text>

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome completo"
          placeholderTextColor={colors.placeholder}
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="rm000000@fiap.com.br"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.dica}>Formato: rm seguido do seu RM numérico</Text>

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor={colors.placeholder}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={[styles.input, senhasIncompativeis && styles.inputErro]}
          placeholder="Repita a senha"
          placeholderTextColor={colors.placeholder}
          secureTextEntry
          value={confirmar}
          onChangeText={setConfirmar}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity style={styles.botao} onPress={cadastrar} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botaoTexto}>Cadastrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkVoltar} onPress={() => router.back()}>
          <Text style={styles.linkTexto}>Já tem conta? <Text style={styles.linkDestaque}>Fazer login</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    card: {
      width: '100%',
      maxWidth: 380,
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 24,
      elevation: 6,
    },
    titulo: {
      fontSize: 26,
      fontWeight: 'bold',
      color: c.primary,
      textAlign: 'center',
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      color: c.textSecondary,
      marginBottom: 8,
      marginTop: 12,
    },
    dica: {
      fontSize: 11,
      color: c.textSecondary,
      marginTop: 4,
    },
    input: {
      backgroundColor: c.inputBackground,
      color: c.text,
      borderColor: c.border,
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    inputErro: {
      borderColor: c.primary,
    },
    erro: {
      color: c.primary,
      fontSize: 13,
      marginTop: 12,
      textAlign: 'center',
    },
    botao: {
      backgroundColor: c.primary,
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
    linkVoltar: {
      marginTop: 16,
      alignItems: 'center',
    },
    linkTexto: {
      color: c.textSecondary,
      fontSize: 14,
    },
    linkDestaque: {
      color: c.primary,
      fontWeight: 'bold',
    },
  });
