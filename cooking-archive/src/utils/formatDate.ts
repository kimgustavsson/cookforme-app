export function formatSavedDate(iso: string, locale = 'ko'): string {
  return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}
