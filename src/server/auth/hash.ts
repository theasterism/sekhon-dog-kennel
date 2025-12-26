import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function checkPassword(password: string, hashedPassword: string) {
  const result = await bcrypt.compare(password, hashedPassword);

  return result;
}
