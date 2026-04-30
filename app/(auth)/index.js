import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const entrar = async () => {
    setErro("");
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha o email e a senha.");
      return;
    }
    setCarregando(true);
    try {
      await login(email.trim().toLowerCase(), senha);
      router.replace("/(app)/perfil");
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
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor={colors.placeholder}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity
          style={styles.botao}
          onPress={entrar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkRegistro}
          onPress={() => router.push("/(auth)/registro")}
        >
          <Text style={styles.linkTexto}>
            Não tem conta? <Text style={styles.linkDestaque}>Criar conta</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    },
    card: {
      width: "100%",
      maxWidth: 380,
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 24,
      elevation: 6,
    },
    titulo: {
      fontSize: 30,
      fontWeight: "bold",
      color: c.primary,
      textAlign: "center",
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      color: c.textSecondary,
      marginBottom: 8,
      marginTop: 12,
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
    erro: {
      color: c.primary,
      fontSize: 13,
      marginTop: 12,
      textAlign: "center",
    },
    botao: {
      backgroundColor: c.primary,
      paddingVertical: 14,
      borderRadius: 10,
      marginTop: 24,
      alignItems: "center",
    },
    botaoTexto: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
    linkRegistro: {
      marginTop: 16,
      alignItems: "center",
    },
    linkTexto: {
      color: c.textSecondary,
      fontSize: 14,
    },
    linkDestaque: {
      color: c.primary,
      fontWeight: "bold",
    },
  });
