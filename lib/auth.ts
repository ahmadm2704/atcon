import crypto from "crypto"

export function hashPassword(password: string): string {
  // Simple hash function - in production, use bcrypt
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}
