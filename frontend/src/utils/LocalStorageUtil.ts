class LocalStorageUtil {
  private static instance: LocalStorageUtil;

  private constructor() {}

  public static getInstance(): LocalStorageUtil {
    if (!LocalStorageUtil.instance) {
      LocalStorageUtil.instance = new LocalStorageUtil();
    }
    return LocalStorageUtil.instance;
  }

  // 设置数据
  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('LocalStorage setItem error:', error);
    }
  }

  // 获取数据
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage getItem error:', error);
      return null;
    }
  }

  // 删除数据
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage removeItem error:', error);
    }
  }

  // 清空所有数据
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('LocalStorage clear error:', error);
    }
  }

  // 检查是否存在
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

export default LocalStorageUtil.getInstance();