import { FeatureFlagClient } from "./index.js";

const sdk = new FeatureFlagClient({
  apiUrl: "http://localhost:8080/api",
  environment: "prod",
  user: { userId: "user_1", region: "US" },
  pollIntervalMs: 5000
});

setInterval(async () => {
  const value = await sdk.getFlag<boolean>("checkout_v3");
  console.log(new Date().toISOString(), value);
}, 3000);
