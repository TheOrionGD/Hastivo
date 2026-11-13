import { describe, expect, it } from "vitest";
import {
  passwordScore,
  validateNewPassword,
  validatePhone,
  validateUsername,
  validateEmail,
} from "@/services/auth/validation";

describe("auth validation", () => {
  it("rejects a password without a symbol", () => {
    expect(validateNewPassword("Abcdefg1")).not.toBe("");
  });
  it("accepts a password meeting all four rules", () => {
    expect(validateNewPassword("Abcdef1!")).toBe("");
    expect(passwordScore("Abcdef1!")).toBe(4);
  });
  it("requires 7-15 digits in a phone number", () => {
    expect(validatePhone("123456")).not.toBe("");
    expect(validatePhone("+91 98765 43210")).toBe("");
  });
  it("limits usernames to 3-20 letters, numbers or underscores", () => {
    expect(validateUsername("ab")).not.toBe("");
    expect(validateUsername("asha_k")).toBe("");
    expect(validateUsername("asha-k")).not.toBe("");
  });
  it("rejects malformed emails", () => {
    expect(validateEmail("name@")).not.toBe("");
    expect(validateEmail("name@example.com")).toBe("");
  });
});
