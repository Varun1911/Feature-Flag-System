import { evaluateFlagRequest } from "./http.js";
import { getCache, setCache } from "./cache.js";
import { UserContext } from "./types.js";

type ClientOptions = {
  apiUrl: string;
  environment: "dev" | "prod";
  user: UserContext;
};

export class FeatureFlagClient {
  private apiUrl: string;
  private environment: "dev" | "prod";
  private user: UserContext;

  constructor(options: ClientOptions) {
    this.apiUrl = options.apiUrl;
    this.environment = options.environment;
    this.user = options.user;
  }

  async getFlag<T = any>(key: string): Promise<T> {
    const cacheKey = `${key}:${this.environment}:${this.user.userId}`;
    console.log(`cacheKey: ${cacheKey}`);

    const cached = getCache(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const response = await evaluateFlagRequest(
      this.apiUrl,
      {
        key,
        environment: this.environment,
        context: this.user
      }
    );

    setCache(cacheKey, response.value);
    return response.value;
  }
}
