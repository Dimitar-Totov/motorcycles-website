'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import loginImg from "../../assets/login.jpeg";
import registerImg from "../../assets/register.jpg";
import { useUser } from "@/context/UserContext";
import { validateEmail, validatePassword } from "@/utils/validators";

function friendlyError(err: unknown, mode: Mode): string {
  const status = (err as { status?: number })?.status;
  const msg = (err instanceof Error ? err.message : "").toLowerCase();

  if (status === 429 || msg.includes("rate limit") || msg.includes("over_email_send_rate_limit"))
    return "Too many attempts. Please wait a few minutes and try again.";
  if (msg.includes("user already registered") || msg.includes("already been registered"))
    return "An account with this email already exists.";
  if (msg.includes("email not confirmed"))
    return "Please confirm your email before signing in.";
  if (msg.includes("password should be at least") || msg.includes("password is too short"))
    return "Password must be at least 6 characters.";
  if (msg.includes("unable to validate email address") || msg.includes("invalid email"))
    return "Please enter a valid email address.";
  if (msg.includes("invalid login credentials") || msg.includes("invalid email or password"))
    return "Invalid email or password.";
  if (msg === "failed to fetch" || msg.includes("networkerror") || msg.includes("network request failed"))
    return "Connection error. Please check your internet and try again.";

  if (status === 400 || status === 401)
    return mode === "signin" ? "Invalid email or password." : "Registration failed. Please try again.";

  return "Something went wrong. Please try again.";
}

type Mode = "signin" | "signup";

const FORM_GRADIENT = {
  background: [
    "radial-gradient(ellipse at 14% 14%, rgba(253,230,138,0.48) 0%, transparent 56%)",
    "radial-gradient(ellipse at 88% 82%, rgba(251,191,36,0.22) 0%, transparent 54%)",
    "radial-gradient(ellipse at 90%  8%, rgba(255,251,235,0.88) 0%, transparent 50%)",
    "#fffdf7",
  ].join(", "),
};

const INPUT_CLS =
  "w-full rounded-full bg-white/80 border px-5 py-3.5 " +
  "text-sm text-neutral-800 placeholder-neutral-400 " +
  "focus:outline-none focus:ring-2 focus:ring-amber-400/50 " +
  "transition duration-150";

const inputCls = (invalid?: boolean) =>
  `${INPUT_CLS} ${invalid ? "border-red-400 focus:ring-red-300" : "border-amber-100 focus:border-amber-200"}`;

const LABEL_CLS = "block text-xs font-medium text-neutral-500 mb-1.5 ml-1";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [showPwdSI, setShowPwdSI] = useState(false);
  const [showPwdSU, setShowPwdSU] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const isSignIn = mode === "signin";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      {/* ── Auth Card ─────────────────────────────────── */}
      <div
        className="
          relative w-full max-w-[1040px] md:min-h-[720px] rounded-3xl overflow-hidden
          shadow-[0_8px_64px_rgba(0,0,0,0.10),0_2px_20px_rgba(0,0,0,0.06)]
          flex flex-col md:flex-row
        "
      >
        {/* Sign In form — LEFT */}
        <div
          style={FORM_GRADIENT}
          className={[
            "w-full md:w-1/2 relative z-10 flex flex-col px-10 sm:px-14 py-12",
            "transition-opacity duration-300",
            isSignIn
              ? "flex opacity-100 delay-300"
              : "hidden md:flex opacity-0 delay-0 pointer-events-none",
          ].join(" ")}
        >
          <FormPanel
            mode="signin"
            showPwd={showPwdSI}
            onTogglePwd={() => setShowPwdSI((v) => !v)}
            onSwitch={() => setMode("signup")}
          />
        </div>

        {/* Sign Up form — RIGHT */}
        <div
          style={FORM_GRADIENT}
          className={[
            "w-full md:w-1/2 relative z-10 flex flex-col px-10 sm:px-14 py-12",
            "transition-opacity duration-300",
            !isSignIn
              ? "flex opacity-100 delay-300"
              : "hidden md:flex opacity-0 delay-0 pointer-events-none",
          ].join(" ")}
        >
          <FormPanel
            mode="signup"
            showPwd={showPwdSU}
            onTogglePwd={() => setShowPwdSU((v) => !v)}
            showConfirmPwd={showConfirmPwd}
            onToggleConfirmPwd={() => setShowConfirmPwd((v) => !v)}
            onSwitch={() => setMode("signin")}
          />
        </div>

        {/* Sliding image panel — desktop only */}
        <div
          className={[
            "hidden md:block absolute top-0 left-1/2 w-1/2 h-full z-20",
            "transition-transform duration-700 ease-in-out",
            isSignIn ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="relative w-full h-full">
            <img
              src={loginImg.src}
              alt=""
              aria-hidden="true"
              className={[
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                isSignIn ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
            <img
              src={registerImg.src}
              alt=""
              aria-hidden="true"
              className={[
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                !isSignIn ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FormPanelProps {
  mode: Mode;
  showPwd: boolean;
  onTogglePwd: () => void;
  showConfirmPwd?: boolean;
  onToggleConfirmPwd?: () => void;
  onSwitch: () => void;
}

function FormPanel({ mode, showPwd, onTogglePwd, showConfirmPwd, onToggleConfirmPwd, onSwitch }: FormPanelProps) {
  const isSignIn = mode === "signin";
  const { login, register } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const errors: Record<string, boolean> = {};

    if (!isSignIn && !fullName.trim()) errors.fullName = true;
    if (validateEmail(email)) errors.email = true;
    if (validatePassword(password)) errors.password = true;
    if (!isSignIn && password !== confirmPassword) errors.confirmPassword = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.fullName) setError("Full name is required.");
      else if (errors.email) setError(validateEmail(email));
      else if (errors.password) setError(validatePassword(password));
      else if (errors.confirmPassword) setError("Passwords do not match.");
      return;
    }

    setFieldErrors({});

    setIsLoading(true);
    try {
      if (isSignIn) {
        await login(email, password);
        router.push("/");
        router.refresh();
      } else {
        const { needsConfirmation } = await register(email, password, fullName);
        if (needsConfirmation) {
          setSuccessMsg("Check your email to confirm your account.");
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err: unknown) {
      setError(friendlyError(err, mode));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Heading */}
      <div className="mb-10">
        <h2 className="font-serif text-[2.125rem] font-light text-neutral-800 tracking-tight leading-tight mb-2">
          {isSignIn ? "Welcome back" : "Create account"}
        </h2>
        <p className="m-0 max-w-none text-sm leading-relaxed text-neutral-400">
          {isSignIn
            ? "Sign in to continue your journey."
            : "Join us and find your perfect ride."}
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5">
        {!isSignIn && (
          <div>
            <label htmlFor="signup-name" className={LABEL_CLS}>
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              className={inputCls(fieldErrors.fullName)}
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setFieldErrors((p) => ({ ...p, fullName: false })); }}
              required
            />
          </div>
        )}

        <div>
          <label htmlFor={`${mode}-email`} className={LABEL_CLS}>
            Email
          </label>
          <input
            id={`${mode}-email`}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={inputCls(fieldErrors.email)}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: false })); }}
            required
          />
        </div>

        <div>
          <label htmlFor={`${mode}-password`} className={LABEL_CLS}>
            Password
          </label>
          <div className="relative">
            <input
              id={`${mode}-password`}
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              autoComplete={isSignIn ? "current-password" : "new-password"}
              className={`${inputCls(fieldErrors.password)} pr-12`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: false })); }}
              required
            />
            <button
              type="button"
              onClick={onTogglePwd}
              aria-label={showPwd ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-neutral-400 hover:text-amber-500 transition-colors duration-150"
            >
              {showPwd ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {!isSignIn && (
          <div>
            <label htmlFor="signup-confirm-password" className={LABEL_CLS}>
              Confirm password
            </label>
            <div className="relative">
              <input
                id="signup-confirm-password"
                type={showConfirmPwd ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`${inputCls(fieldErrors.confirmPassword)} pr-12`}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: false })); }}
                required
              />
              <button
                type="button"
                onClick={onToggleConfirmPwd}
                aria-label={showConfirmPwd ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-neutral-400 hover:text-amber-500 transition-colors duration-150"
              >
                {showConfirmPwd ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error / success feedback */}
      {error && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-100 px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-600 leading-relaxed">{error}</p>
        </div>
      )}
      {successMsg && (
        <p className="mt-4 text-xs text-green-600 text-center">{successMsg}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          mt-8 w-full py-3.5 rounded-full bg-amber-400 text-neutral-900
          font-semibold text-sm tracking-wide
          hover:bg-amber-500 active:scale-[0.98] transition-all duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2
          disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
        "
      >
        {isLoading ? "Please wait…" : isSignIn ? "Sign in" : "Create account"}
      </button>

      {/* Spacer: flex-1 pins footer to bottom when card has a fixed height */}
      <div className="flex-1 min-h-8" aria-hidden="true" />

      {/* Footer row */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>
          {isSignIn ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitch}
                className="text-amber-600 underline underline-offset-2 hover:text-amber-700 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Have an account?{" "}
              <button
                type="button"
                onClick={onSwitch}
                className="text-amber-600 underline underline-offset-2 hover:text-amber-700 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
              >
                Sign in
              </button>
            </>
          )}
        </span>
        <Link
          href="/terms"
          className="hover:text-amber-600 underline underline-offset-2 transition-colors"
        >
          Terms & Conditions
        </Link>
      </div>
    </form>
  );
}
