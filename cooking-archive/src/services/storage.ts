// 진단용 임시: mmkv 우회
export const storage = {
  getString: (_k: string) => undefined,
  set: (_k: string, _v: string) => {},
  delete: (_k: string) => {},
} as any;
