# Cooking Archive

링크·유튜브·사진에서 레시피를 추출해 저장하는 React Native (Expo) 앱.

## 아키텍처 한눈에

- **feature-first**: `src/features/*` 가 자급자족. feature끼리 직접 import 금지(공유는 `components/`·`services/`로).
- **입력 소스 수렴**: 웹/유튜브/이미지 → 백엔드 `/extract` 하나 → 동일한 `Recipe`.
- **상태 분리**: 추출=TanStack Query mutation / 목록=Query(+MMKV 오프라인 캐시) / 인증=Supabase 세션.
- **권한**: 관계 없이 `ownerId` + `visibility`로만. RLS가 DB에서 강제.
- **네비게이션**: `RootNavigator`가 세션으로 분기(Splash → Auth | AppTabs).

## 데이터 흐름

입력 → `detectSourceKind` → `useScrapeRecipe`(/extract) → `Recipe(draft)`
→ `RecipeReviewScreen`(확인) → `useSaveRecipe`(saved) → Supabase + 캐시

## 실행

```bash
npm install
npx expo install   # Expo 호환 버전으로 정렬
cp .env.example .env   # Supabase 값 채우기
npm start
```

## 배포 (EAS)

```bash
npm run build:preview   # 내부 테스트 (TestFlight / Play 내부 트랙)
npm run build:prod
npm run submit
```

## 다음 할 일 (TODO)

- 백엔드 `supabase/functions/extract` 3개 추출기 실제 구현
- `delete-account` Edge Function (계정 삭제 — 애플 심사 필수)
- `RecipeReviewScreen` 인라인 편집
- splash / 아이콘 에셋 교체, 개인정보처리방침 URL
