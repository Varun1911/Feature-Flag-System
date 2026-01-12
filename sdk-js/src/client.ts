import { evaluateFlagRequest } from "./http.js";
import { getCache, setCache } from "./cache.js";
import { UserContext } from "./types.js";

type ClientOptions = {
  apiUrl: string;
  environment: "dev" | "prod";
  user: UserContext;
  pollIntervalMs?: number;
};

export class FeatureFlagClient {
  private apiUrl: string;
  private environment: "dev" | "prod";
  private user: UserContext;
  private pollInterval: number;
  private usedFlags = new Set<string>();

  constructor(options: ClientOptions) {
    this.apiUrl = options.apiUrl;
    this.environment = options.environment;
    this.user = options.user;
    this.pollInterval = options.pollIntervalMs ?? 15000;

    this.startPolling();
  }

  async getFlag<T = any>(key: string): Promise<T> {
    const cacheKey = `${key}:${this.environment}:${this.user.userId}`;

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
    this.usedFlags.add(key);

    return response.value;
  }

  private startPolling() {
    setInterval(async () => {
      for (const key of this.usedFlags) {
        const response = await evaluateFlagRequest(this.apiUrl, {
          key,
          environment: this.environment,
          context: this.user
        });

        const cacheKey = `${key}:${this.environment}:${this.user.userId}`;
        setCache(cacheKey, response.value);
      }
    }, this.pollInterval);
  }
}
