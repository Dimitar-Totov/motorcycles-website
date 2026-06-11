import type { Metadata } from 'next';
import AuthForm from './AuthForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: "Sign in or create an account to list and manage motorcycles on Dimitar's Motorcycles.",
};

// Guest-only protection is enforced in middleware (authenticated users are
// redirected to /profile), so the page simply renders the interactive form.
export default function AuthPage() {
  return <AuthForm />;
}
