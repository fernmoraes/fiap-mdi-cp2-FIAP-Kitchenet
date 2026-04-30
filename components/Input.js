import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../lib/context/ThemeContext';

export default function Input({ style, ...props }) {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.inputBackground,
          color: colors.text,
          borderColor: colors.border,
        },
        style,
      ]}
      placeholderTextColor={colors.placeholder}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
});
