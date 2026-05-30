export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!/^[^!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]?[^!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/.test(password))
    return "Password may contain at most 1 special character.";
  return null;
}
