import { describe, it, expect } from "vitest";

describe("Firebase Configuration", () => {
  it("should have all required Firebase environment variables", () => {
    expect(process.env.VITE_FIREBASE_API_KEY).toBeDefined();
    expect(process.env.VITE_FIREBASE_AUTH_DOMAIN).toBeDefined();
    expect(process.env.VITE_FIREBASE_PROJECT_ID).toBeDefined();
    expect(process.env.VITE_FIREBASE_STORAGE_BUCKET).toBeDefined();
    expect(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID).toBeDefined();
    expect(process.env.VITE_FIREBASE_APP_ID).toBeDefined();
  });

  it("should have valid Firebase configuration values", () => {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    const authDomain = process.env.VITE_FIREBASE_AUTH_DOMAIN;
    
    expect(projectId).toBe("sistema-gestao-pacientes");
    expect(authDomain).toContain("firebaseapp.com");
    expect(authDomain).toContain(projectId);
  });

  it("should have valid API key format", () => {
    const apiKey = process.env.VITE_FIREBASE_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey?.length).toBeGreaterThan(20);
  });
});
