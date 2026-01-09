import { FeatureFlagClient } from "@varun-taneja/feature-flag-sdk";

const client = new FeatureFlagClient({
  apiUrl: "http://localhost:8080/api",
  environment: "prod",
  user: { userId: "user_123", region: "US" }
});

const run = async () => {
  const value = await client.getFlag("checkout_v2");
  console.log("checkout_v2:", value);
};

run();
