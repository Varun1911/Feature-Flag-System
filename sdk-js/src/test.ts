import { FeatureFlagClient } from "./index.js";

// const client = new FeatureFlagClient({
//   apiUrl: "http://localhost:8080/api",
//   environment: "prod",
//   user: {
//     userId: "user_1123",
//     region: "US",
//     subscriptionType: "premium"
//   }
// });

// const run = async () => {
//   const checkoutEnabled = await client.getFlag<boolean>("checkout_v3");
//   console.log("checkout_v3:", checkoutEnabled);

//   const analytics = await client.getFlag<boolean>("advanced_analytics");
//   console.log("advanced_analytics:", analytics);

//   for (let i = 0; i < 5; i++) {
//   const value = await client.getFlag<boolean>("checkout_v3");
//   console.log(i, value);
//   }
// };

// run();

const clientA = new FeatureFlagClient({
  apiUrl: "http://localhost:8080/api",
  environment: "prod",
  user: { userId: "user_1", region: "US" }
});

const clientB = new FeatureFlagClient({
  apiUrl: "http://localhost:8080/api",
  environment: "prod",
  user: { userId: "user_2" }
});

console.log(await clientA.getFlag("checkout_v3"));
console.log(await clientB.getFlag("checkout_v3"));
