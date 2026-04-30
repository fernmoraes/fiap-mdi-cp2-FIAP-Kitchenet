import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../lib/context/ThemeContext';

export default function Button({ title, onPress, disabled, loading, variant = 'primary', style }) {
  const { colors } = useTheme();

  const bg = variant === 'secondary' ? colors.disabled : colors.primary;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bg }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
