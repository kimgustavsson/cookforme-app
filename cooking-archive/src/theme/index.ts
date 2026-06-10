// 디자인 토큰. 스케치의 크림색 톤을 반영했습니다.
// 색·간격을 여기서만 정의하면 전 화면이 일관되게 따라옵니다.
// (폰트 크기는 OS 설정을 존중하도록 RN 기본 동작에 맡깁니다 — 부모님 큰 글씨 대응)
export const theme = {
  colors: {
    background: '#FBF7EC',
    surface: '#FFFFFF',
    border: '#E8E0CC',
    text: '#2C2A24',
    textMuted: '#8A8472',
    accent: '#6B6B3A',
    accentSoft: '#EDE9D0',
    danger: '#B3261E',
    dangerSoft: '#F4D9D7',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24 },
  radius: { sm: 8, md: 12, lg: 16 },
} as const;
