import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import loginImg from "../../assets/login.jpeg";
import registerImg from "../../assets/register.jpg";

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
  "w-full rounded-full bg-white/80 border border-amber-100 px-5 py-3.5 " +
  "text-sm text-neutral-800 placeholder-neutral-400 " +
  "focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-200 " +
  "transition duration-150";

const LABEL_CLS = "block text-xs font-medium text-neutral-500 mb-1.5 ml-1";

export default function Auth() {
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
              src={loginImg}
              alt=""
              aria-hidden="true"
              className={[
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                isSignIn ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
            <img
              src={registerImg}
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

  return (
    <>
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
              className={INPUT_CLS}
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
            className={INPUT_CLS}
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
              className={`${INPUT_CLS} pr-12`}
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
                className={`${INPUT_CLS} pr-12`}
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

      {/* Submit */}
      <button
        type="submit"
        className="
          mt-8 w-full py-3.5 rounded-full bg-amber-400 text-neutral-900
          font-semibold text-sm tracking-wide
          hover:bg-amber-500 active:scale-[0.98] transition-all duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2
        "
      >
        Submit
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
        <NavLink
          to="/terms"
          className="hover:text-amber-600 underline underline-offset-2 transition-colors"
        >
          Terms & Conditions
        </NavLink>
      </div>
    </>
  );
}
