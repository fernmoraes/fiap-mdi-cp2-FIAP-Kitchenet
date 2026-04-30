import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorage(key, initialValue = null) {
  const [value, setValue] = useState(initialValue);

  const load = useCallback(async () => {
    const stored = await AsyncStorage.getItem(key);
    if (stored !== null) {
      try {
        setValue(JSON.parse(stored));
      } catch {
        setValue(stored);
      }
    }
  }, [key]);

  const save = useCallback(async (newValue) => {
    setValue(newValue);
    await AsyncStorage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  const remove = useCallback(async () => {
    setValue(initialValue);
    await AsyncStorage.removeItem(key);
  }, [key]);

  return { value, load, save, remove };
}
