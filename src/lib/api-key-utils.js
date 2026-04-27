export const API_KEYS_TABLE = "api_keys";

export function randomApiKey() {
  const a = Math.random().toString(16).slice(2);
  const b = Math.random().toString(16).slice(2);
  const c = Date.now().toString(16);
  return `dandi_${c}_${a}${b}`.slice(0, 48);
}
