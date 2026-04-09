export function verifyAdminCredentials(username: string, password: string): boolean {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_USERNAME or ADMIN_PASSWORD env var is not set");
  }
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}
