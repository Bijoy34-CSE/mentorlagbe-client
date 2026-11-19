import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

// Auth calls use the website's own address. Next.js forwards them to the API server.
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        phone: { type: "string" },
        bio: { type: "string" },
        plan: { type: "string" },
      },
    }),
  ],
});