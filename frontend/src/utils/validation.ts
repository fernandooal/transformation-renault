/** Validações dos formulários de autenticação. */

export const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const minLength = (v: string, n: number): boolean => v.trim().length >= n;

export const passwordsMatch = (a: string, b: string): boolean => a.length > 0 && a === b;

export const required = (v: string): boolean => v.trim().length > 0;
