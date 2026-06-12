import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { Button } from "@/components/ui/Button";
import { useActiveGroup } from "../hooks/useActiveGroup";
import {
  createGroup,
  createPersonalGroup,
  joinGroupByCode,
} from "../api/groupApi";
import { theme } from "@/theme";
import * as Clipboard from "expo-clipboard";

type Mode = "choose" | "create" | "join" | "done";

// 처음 한 번 뜨는 온보딩: 새 그룹 만들기 / 코드로 참여 / 혼자 시작.
export function OnboardingScreen() {
  const { t } = useTranslation();
  const { setActiveGroupId } = useActiveGroup();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<Mode>("choose");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null); // ← 추가
  const [busy, setBusy] = useState(false);

  // 새 그룹: DB엔 만들어지지만, "시작하기"를 누르기 전엔 활성화/이동을 미룸
  async function handleCreate() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const g = await createGroup(name.trim());
      setCreatedGroupId(g.id); // id만 기억 (아직 활성화 X → 화면 안 넘어감)
      setCreatedCode(g.inviteCode);
      setMode("done");
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: e.message ?? t("onboarding.createFailed"),
      });
    } finally {
      setBusy(false);
    }
  }

  // 참여: 토스트 띄우고 자동 전환에 맡김
  async function handleJoin() {
    if (!code.trim()) return;
    setBusy(true);
    try {
      const groupId = await joinGroupByCode(code.trim());
      setActiveGroupId(groupId);
      await queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      Toast.show({ type: "success", text1: t("onboarding.joinedToast") });
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: e.message ?? t("onboarding.joinFailed"),
      });
    } finally {
      setBusy(false);
    }
  }

  // 혼자: 토스트 띄우고 자동 전환에 맡김
  async function handleSolo() {
    setBusy(true);
    try {
      const g = await createPersonalGroup();
      setActiveGroupId(g.id);
      await queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      Toast.show({ type: "success", text1: t("onboarding.soloToast") });
    } catch (e: any) {
      Toast.show({ type: "error", text1: e.message ?? t("onboarding.retry") });
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    if (!createdCode) return;
    await Clipboard.setStringAsync(createdCode);
    Toast.show({ type: "success", text1: t("onboarding.codeCopied") });
  }

  // done 화면에서 "시작하기" → 이제 활성화 + 무효화 → 홈으로 자동 전환
  async function handleStart() {
    if (createdGroupId) setActiveGroupId(createdGroupId);
    await queryClient.invalidateQueries({ queryKey: ["myGroups"] });
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

  // 4) 그룹 생성 완료 → 코드 보여주기 + 시작하기
  // 4) 그룹 생성 완료 → 환영 + 코드 + 복사/시작하기
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{t("onboarding.doneTitle")}</Text>
      <Text style={styles.welcome}>{t("onboarding.doneWelcome")}</Text>
      <Text style={styles.sub}>{t("onboarding.doneShareHint")}</Text>

      {/* 코드 박스를 눌러도 복사됨 */}
      <Pressable onPress={handleCopy} style={styles.codeBox}>
        <Text style={styles.bigCode}>{createdCode}</Text>
      </Pressable>

      <Button
        label={t("onboarding.copyCode")}
        variant="ghost"
        onPress={handleCopy}
      />
      <Text style={styles.sub}>{t("onboarding.doneSettingsHint")}</Text>
      <Button label={t("onboarding.startCooking")} onPress={handleStart} />
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
  welcome: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
});
