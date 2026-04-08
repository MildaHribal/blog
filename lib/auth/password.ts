export function verifyAdminCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminUsername || !adminPassword) {
    throw new Error("Missing ADMIN_USERNAME or ADMIN_PASSWORD env var");
  }
  return username === adminUsername && password === adminPassword;
}
