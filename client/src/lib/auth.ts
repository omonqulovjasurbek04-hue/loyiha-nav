export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function setTokens(access: string, refresh: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }
}

export function clearTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;
    const payload = JSON.parse(atob(payloadBase64));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}
