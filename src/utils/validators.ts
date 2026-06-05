import type { ProductForm, FieldErrors } from '../types/create-product';

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

export function validateProductForm(form: ProductForm): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.model.trim()) errors.model = 'Model is required.';
  if (!form.brand.trim()) errors.brand = 'Brand is required.';
  const year = Number(form.year);
  if (!form.year || Number.isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1)
    errors.year = `Year must be between 1900 and ${new Date().getFullYear() + 1}.`;
  if (!form.color.trim()) errors.color = 'Color is required.';
  const power = Number(form.powerKw);
  if (!form.powerKw || Number.isNaN(power) || power <= 0)
    errors.powerKw = 'Power must be a positive number.';
  if (!form.engine.trim()) errors.engine = 'Engine is required.';
  const price = Number(form.price);
  if (!form.price || Number.isNaN(price) || price <= 0)
    errors.price = 'Price must be a positive number.';
  if (!form.silhouetteCategory)
    errors.silhouetteCategory = 'Please select a category.';
  return errors;
}
