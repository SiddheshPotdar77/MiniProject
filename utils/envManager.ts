export class EnvManager {
  private static instance: EnvManager;
  private constructor() {}

  public static getInstance(): EnvManager {
    if (!EnvManager.instance) {
      EnvManager.instance = new EnvManager();
    }
    return EnvManager.instance;
  }

  public get(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (!value) {
      throw new Error(`Environment variable ${key} is not set and no default provided`);
    }
    return value;
  }

  public getBaseUrl(): string {
  return this.get('BASE_URL', 'https://restful-booker.herokuapp.com/');
}

  public getApiKey(): string {
    return this.get('API_KEY');
  }

  public getRestApiCollection(): string {
    return this.get('REST_API_COLLECTION');
  }
}

export const env = EnvManager.getInstance();
