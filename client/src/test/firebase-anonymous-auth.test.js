import { describe, expect, it } from "vitest";
import {
  friendlyAnonymousError,
  getMissingFirebaseConfig,
  isFirebaseConfigured,
  readFirebaseConfig,
  upgradeAnonymousAccount,
} from "@/services/auth/firebaseAnonymousAuth";

const completeConfig = {
  VITE_FIREBASE_API_KEY: "web-api-key",
  VITE_FIREBASE_AUTH_DOMAIN: "hastivo.example.com",
  VITE_FIREBASE_PROJECT_ID: "hastivo",
  VITE_FIREBASE_APP_ID: "web-app-id",
};

describe("Firebase anonymous authentication", () => {
  it("requires the complete Firebase web configuration", () => {
    expect(getMissingFirebaseConfig({ VITE_FIREBASE_API_KEY: "web-api-key" })).toEqual([
      "VITE_FIREBASE_AUTH_DOMAIN",
      "VITE_FIREBASE_PROJECT_ID",
      "VITE_FIREBASE_APP_ID",
    ]);
    expect(isFirebaseConfigured({})).toBe(false);
  });

  it("accepts a complete configuration and trims values", () => {
    const env = Object.fromEntries(
      Object.entries(completeConfig).map(([key, value]) => [key, ` ${value} `]),
    );
    expect(isFirebaseConfigured(env)).toBe(true);
    expect(readFirebaseConfig(env)).toEqual({
      apiKey: "web-api-key",
      authDomain: "hastivo.example.com",
      projectId: "hastivo",
      appId: "web-app-id",
    });
  });

  it("explains when Firebase's Anonymous provider is disabled", () => {
    expect(friendlyAnonymousError({ code: "auth/admin-restricted-operation" })).toBe(
      "Anonymous sign-in is disabled in Firebase. Enable the Anonymous provider and try again.",
    );
  });

  it("links credentials to the same guest UID instead of creating a new account", async () => {
    const guest = { uid: "guest-123", isAnonymous: true };
    let linkedUser;
    let credentialInput;
    const loader = async () => ({
      auth: { currentUser: guest },
      authSdk: {
        EmailAuthProvider: {
          credential: (email, password) => {
            credentialInput = { email, password };
            return { provider: "password" };
          },
        },
        linkWithCredential: async (user, credential) => {
          linkedUser = user;
          expect(credential).toEqual({ provider: "password" });
          return { user: { uid: user.uid, isAnonymous: false, email: "person@example.com" } };
        },
      },
    });

    const result = await upgradeAnonymousAccount(
      { email: " person@example.com ", password: "Strong!Pass1" },
      loader,
    );

    expect(linkedUser).toBe(guest);
    expect(credentialInput).toEqual({ email: "person@example.com", password: "Strong!Pass1" });
    expect(result.user.uid).toBe("guest-123");
    expect(result.user.isAnonymous).toBe(false);
  });

  it("refuses to upgrade when there is no active guest", async () => {
    const loader = async () => ({
      auth: { currentUser: { uid: "permanent-123", isAnonymous: false } },
      authSdk: {},
    });
    await expect(
      upgradeAnonymousAccount({ email: "person@example.com", password: "Strong!Pass1" }, loader),
    ).rejects.toMatchObject({ code: "hastivo/not-anonymous" });
  });
});
