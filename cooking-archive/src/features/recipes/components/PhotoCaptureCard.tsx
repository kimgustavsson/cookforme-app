import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { theme } from '@/theme';

// "Add a photo or screenshot" 카드. (스케치 ① 의 Photo 영역)
// 카메라/사진첩으로 이미지를 받아 base64로 넘깁니다 → image 소스로 추출.
export function PhotoCaptureCard({ onPick }: { onPick: (base64: string) => void }) {
  const { t } = useTranslation();

  async function pick() {
    const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
    if (!res.canceled && res.assets[0]?.base64) onPick(res.assets[0].base64);
  }

  return (
    <Pressable onPress={pick} style={styles.card}>
      <View style={styles.inner}>
        <Text style={styles.plus}>＋</Text>
        <Text style={styles.label}>{t('home.addPhoto')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: theme.colors.border,
    borderRadius: 16, padding: 32, backgroundColor: theme.colors.surface,
  },
  inner: { alignItems: 'center', gap: 8 },
  plus: { fontSize: 28, color: theme.colors.textMuted },
  label: { fontSize: 15, color: theme.colors.textMuted },
});
