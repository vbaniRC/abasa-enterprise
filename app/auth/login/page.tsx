import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="bg-white text-black border border-neutral-200 rounded-xl shadow-lg p-10 w-full max-w-[460px] mx-auto">
      <h1 className="text-xl font-semibold mb-10 text-center">
        Log in to ABASA Clubs
      </h1>

      <div className="flex flex-col items-center gap-8">

        {/* Email input – crna podloga */}
        <input
          type="email"
          placeholder="Email"
          className="w-[90%] h-12 bg-black text-white border border-neutral-700 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-white"
        />

        {/* Continue with Email */}
        <button className="w-[90%] h-12 rounded-lg text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center border border-neutral-300">
          Continue with Email
        </button>

        {/* Google */}
        <button className="w-[90%] h-12 rounded-lg text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center gap-2 border border-neutral-300">
          <FcGoogle size={18} />
          <span>Continue with Google</span>
        </button>

        {/* Apple */}
        <button className="w-[90%] h-12 rounded-lg text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center gap-2 border border-neutral-300">
          <FaApple size={18} />
          <span>Continue with Apple</span>
        </button>

        {/* Passkey */}
        <button className="w-[90%] h-12 rounded-lg text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center border border-neutral-300">
          Continue with Passkey
        </button>

        {/* Show other options – referentni stil */}
        <button className="text-sm text-neutral-600 hover:underline">
          Show other options
        </button>
      </div>

      {/* Sign Up link */}
      <p className="text-sm text-neutral-600 mt-10 text-center">
        Don’t have an account?{" "}
        <a
          href="/auth/register"
          className="text-neutral-500 font-medium hover:underline"
        >
          Sign Up
        </a>
      </p>
    </div>
  );
}
