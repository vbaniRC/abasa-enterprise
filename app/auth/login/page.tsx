import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-[420px] bg-[#111111] border border-neutral-800 rounded-2xl p-10 shadow-2xl">

        <h1 className="text-xl font-semibold mb-8 text-center text-white">
          Log in to ABASA Clubs
        </h1>

        <div className="flex flex-col items-center gap-4">

          {/* Email input */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full h-12 bg-black text-white border border-neutral-700 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/* Continue with Email */}
          <button className="w-full h-12 rounded-lg text-sm font-medium bg-white text-black hover:bg-neutral-200 transition flex items-center justify-center">
            Continue with Email
          </button>

          {/* Google */}
          <button className="w-full h-12 rounded-lg text-sm font-medium bg-white text-black hover:bg-neutral-200 transition flex items-center justify-center gap-2">
            <FcGoogle size={18} />
            <span>Continue with Google</span>
          </button>

          {/* Apple */}
          <button className="w-full h-12 rounded-lg text-sm font-medium bg-white text-black hover:bg-neutral-200 transition flex items-center justify-center gap-2">
            <FaApple size={18} />
            <span>Continue with Apple</span>
          </button>

          {/* Passkey */}
          <button className="w-full h-12 rounded-lg text-sm font-medium bg-white text-black hover:bg-neutral-200 transition flex items-center justify-center">
            Continue with Passkey
          </button>

          {/* Show other options */}
          <button className="text-sm text-neutral-400 hover:underline mt-2">
            Show other options
          </button>
        </div>

        {/* Sign Up link */}
        <p className="text-sm text-neutral-500 mt-10 text-center">
          Don’t have an account?{" "}
          <a
            href="/auth/register"
            className="text-neutral-300 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
