import type { ProductForm } from '../types/types';

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

export function validateProductForm(form: ProductForm): string[] {
  const errors: string[] = [];
  if (!form.name.trim()) errors.push('Name is required.');
  if (!form.model.trim()) errors.push('Model is required.');
  if (!form.brand.trim()) errors.push('Brand is required.');
  const year = Number(form.year);
  if (!form.year || Number.isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1)
    errors.push(`Year must be between 1900 and ${new Date().getFullYear() + 1}.`);
  if (!form.color.trim()) errors.push('Color is required.');
  const power = Number(form.powerKw);
  if (!form.powerKw || Number.isNaN(power) || power <= 0)
    errors.push('Power must be a positive number.');
  if (!form.engine.trim()) errors.push('Engine is required.');
  const price = Number(form.price);
  if (!form.price || Number.isNaN(price) || price <= 0)
    errors.push('Price must be a positive number.');
  if (!form.silhouetteCategory)
    errors.push('Please select a category.');
  if (form.licenseCategories.length === 0)
    errors.push('Please select at least one license category.');
  if (!form.phone || !form.phone.trim()) errors.push('Phone number is required.');
  else if (!/^\+?[0-9 ()\-]{7,25}$/.test(form.phone)) errors.push('Enter a valid phone number.');
  return errors;
}
