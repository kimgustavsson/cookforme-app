// 링크 유효성 검사. invalid 링크는 입력 단계에서 바로 걸러냅니다.
export function validateUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
