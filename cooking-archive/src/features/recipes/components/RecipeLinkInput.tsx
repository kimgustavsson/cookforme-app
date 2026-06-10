import { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { theme } from '@/theme';
import { validateUrl } from '@/utils/validateUrl';

// "Paste a copied link here" 입력칸. (스케치 ① 의 Recipe Link 영역)
export function RecipeLinkInput({ onSubmit }: { onSubmit: (url: string) => void }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const invalid = url.length > 0 && !validateUrl(url);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder={t('home.pasteLink')}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
        />
        <Button label={t('home.save')} disabled={invalid || !url} onPress={() => onSubmit(url)} />
      </View>
      {invalid && <Text style={styles.error}>{t('home.invalidLink')}</Text>}
      <Text style={styles.hint}>{t('home.linkHint')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, fontSize: 16, color: theme.colors.text },
  hint: { fontSize: 12, color: theme.colors.textMuted },
  error: { fontSize: 12, color: theme.colors.danger },
});
