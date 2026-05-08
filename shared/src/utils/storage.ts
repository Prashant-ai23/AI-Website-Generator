export class StorageService {
  static setItem(key: string, value: unknown): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static getItem<T>(key: string): T | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  static removeItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }

  static clear(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
  }
}
