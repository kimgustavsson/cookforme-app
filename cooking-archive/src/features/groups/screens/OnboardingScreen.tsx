import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { useActiveGroup } from "@/features/groups";
import {
  createGroup,
  createPersonalGroup,
  joinGroupByCode,
} from "@/features/groups";
import { theme } from "@/theme";

type Mode = "choose" | "create" | "join" | "done";

// 처음 한 번 뜨는 온보딩: 새 그룹 만들기 / 코드로 참여 / 혼자 시작.
// 어느 길이든 끝에 setActiveGroupId로 활성 그룹을 정함.
export function OnboardingScreen() {
  const { t } = useTranslation();
  const { setActiveGroupId } = useActiveGroup();
  const [mode, setMode] = useState<Mode>("choose");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const g = await createGroup(name.trim());
      setActiveGroupId(g.id); // 활성 그룹 지정
      setCreatedCode(g.inviteCode); // 코드를 크게 보여주기
      setMode("done");
    } catch (e: any) {
      Alert.alert(
        t("onboarding.errorTitle"),
        e.message ?? t("onboarding.createFailed"),
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    if (!code.trim()) return;
    setBusy(true);
    try {
      const groupId = await joinGroupByCode(code.trim());
      setActiveGroupId(groupId);
      // 참여 완료 → 다음 단계(네비게이션 연결)에서 홈으로 보냄
    } catch (e: any) {
      Alert.alert(
        t("onboarding.joinFailedTitle"),
        e.message ?? t("onboarding.joinFailed"),
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSolo() {
    setBusy(true);
    try {
      const g = await createPersonalGroup();
      setActiveGroupId(g.id);
    } catch (e: any) {
      Alert.alert(
        t("onboarding.errorTitle"),
        e.message ?? t("onboarding.retry"),
      );
    } finally {
      setBusy(false);
    }
  }

  // 1) 선택 화면
  if (mode === "choose") {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>{t("onboarding.chooseTitle")}</Text>
        <Text style={styles.sub}>{t("onboarding.chooseSub")}</Text>
        <Button
          label={t("onboarding.createGroup")}
          onPress={() => setMode("create")}
        />
        <Button
          label={t("onboarding.joinGroup")}
          variant="ghost"
          onPress={() => setMode("join")}
        />
        <Pressable onPress={handleSolo} disabled={busy}>
          <Text style={styles.skip}>{t("onboarding.soloStart")}</Text>
        </Pressable>
      </View>
    );
  }

  // 2) 새 그룹 만들기
  if (mode === "create") {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>{t("onboarding.createTitle")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("onboarding.groupNamePlaceholder")}
          value={name}
          onChangeText={setName}
        />
        <Button
          label={busy ? t("onboarding.creating") : t("onboarding.create")}
          disabled={busy}
          onPress={handleCreate}
        />
        <Pressable onPress={() => setMode("choose")}>
          <Text style={styles.skip}>{t("onboarding.back")}</Text>
        </Pressable>
      </View>
    );
  }

  // 3) 코드로 참여
  if (mode === "join") {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>{t("onboarding.joinTitle")}</Text>
        <TextInput
          style={[styles.input, styles.code]}
          placeholder={t("onboarding.codePlaceholder")}
          autoCapitalize="characters"
          value={code}
          onChangeText={setCode}
          maxLength={6}
        />
        <Button
          label={busy ? t("onboarding.joining") : t("onboarding.join")}
          disabled={busy}
          onPress={handleJoin}
        />
        <Pressable onPress={() => setMode("choose")}>
          <Text style={styles.skip}>{t("onboarding.back")}</Text>
        </Pressable>
      </View>
    );
  }

  // 4) 그룹 생성 완료 → 코드 공유 화면
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{t("onboarding.doneTitle")}</Text>
      <Text style={styles.sub}>{t("onboarding.doneShareHint")}</Text>
      <View style={styles.codeBox}>
        <Text style={styles.bigCode}>{createdCode}</Text>
      </View>
      <Text style={styles.sub}>{t("onboarding.doneSettingsHint")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 14,
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  h1: { fontSize: 26, fontWeight: "700", color: theme.colors.text },
  sub: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 4 },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
  },
  code: { fontSize: 22, letterSpacing: 4, textAlign: "center" },
  skip: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    textDecorationLine: "underline",
  },
  codeBox: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  bigCode: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 8,
    color: theme.colors.accent,
  },
});
