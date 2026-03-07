"use client";

import { useRouter } from "next/navigation";
import { usePlanStore } from "../state/planStore";

export default function SignupPage() {
  const router = useRouter();
  const userName = usePlanStore((s) => s.userName);
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);

  const handleContinue = () => {
    if (!onboardingComplete) {
      router.push("/onboarding");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F8F6F1] px-6">
      <div className="mx-auto w-full max-w-md">
        <h1
          className="text-center text-[28px] font-bold text-[#121212]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {userName ? `Save your plan, ${userName}` : "Create your account"}
        </h1>
        <p className="mt-2 text-center text-[15px] text-[#6A6A6A]">
          Your plan is ready. Create an account to save it.
        </p>

        {/* Social sign-up (primary) */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleContinue}
            className="flex h-[56px] w-full items-center justify-center gap-3 rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-transform active:scale-[0.97]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <button
            onClick={handleContinue}
            className="flex h-[56px] w-full items-center justify-center gap-3 rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-transform active:scale-[0.97]"
          >
            <AppleIcon />
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E0E0E0]" />
          <span className="text-[13px] text-[#6A6A6A]">or</span>
          <div className="h-px flex-1 bg-[#E0E0E0]" />
        </div>

        {/* Email/password (secondary) */}
        <div className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="h-[48px] w-full rounded-2xl border border-[#E0E0E0] bg-white px-4 text-[15px] text-[#121212] placeholder:text-[#121212]/30 focus:border-[#121212] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="h-[48px] w-full rounded-2xl border border-[#E0E0E0] bg-white px-4 text-[15px] text-[#121212] placeholder:text-[#121212]/30 focus:border-[#121212] focus:outline-none"
          />
          <button
            onClick={handleContinue}
            className="flex h-[48px] w-full items-center justify-center rounded-[24px] border border-[#121212] text-[15px] font-semibold text-[#121212] transition-transform active:scale-[0.97]"
          >
            Create account
          </button>
        </div>

        {/* Skip */}
        <button
          onClick={handleContinue}
          className="mx-auto mt-6 block text-[14px] text-[#6A6A6A] underline"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
