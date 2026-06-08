import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="bg-white text-black border border-neutral-200 rounded-xl shadow-lg p-10 w-full max-w-[420px] mx-auto">
      <h1 className="text-xl font-semibold mb-10 text-center">
        Log in to ABASA Clubs
      </h1>

      <div className="flex flex-col items-center gap-6">

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-[90%] border border-neutral-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Continue with Email */}
        <button className="w-[90%] h-12 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center">
          Continue with Email
        </button>

        {/* Google */}
        <button className="w-[90%] h-12 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center gap-2">
          <FcGoogle size={18} />
          <span>Continue with Google</span>
        </button>

        {/* Apple */}
        <button className="w-[90%] h-12 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center gap-2">
          <FaApple size={18} />
          <span>Continue with Apple</span>
        </button>

        {/* Passkey */}
        <button className="w-[90%] h-12 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center">
          Continue with Passkey
        </button>

        {/* Show other options */}
        <button className="text-sm text-neutral-600 hover:underline mt-2">
          Show other options
        </button>
      </div>

      <p className="text-sm text-neutral-600 mt-10 text-center">
        Don’t have an account?{" "}
        <a href="/auth/register" className="text-black font-medium hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
}
