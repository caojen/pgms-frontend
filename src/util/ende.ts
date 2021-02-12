export function encodeToHttp (password: string): string {
  return btoa(password)
}
