import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="bg-white text-black border border-neutral-200 rounded-xl shadow-lg p-10 w-full">
      <h1 className="text-xl font-semibold mb-8">Log in to ABASA Clubs</h1>

      <div className="space-y-4">

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Continue with Email */}
        <button className="w-full border border-neutral-300 rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-100 transition">
          Continue with Email
        </button>

        {/* Google */}
        <button className="w-full border border-neutral-300 rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center gap-2">
          <FcGoogle size={18} />
          <span>Continue with Google</span>
        </button>

        {/* GitHub */}
        <button className="w-full border border-neutral-300 rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center gap-2">
          <FaGithub size={18} />
          <span>Continue with GitHub</span>
        </button>

        {/* Apple */}
        <button className="w-full border border-neutral-300 rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center gap-2">
          <FaApple size={18} />
          <span>Continue with Apple</span>
        </button>

        {/* SAML */}
        <button className="w-full border border-neutral-300 rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-100 transition">
          Continue with SAML SSO
        </button>

        {/* Passkey */}
        <button className="w-full border border-neutral-300 rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-100 transition">
          Continue with Passkey
        </button>

        <div className="text-center">
          <button className="text-sm text-neutral-600 hover:underline">
            Show other options
          </button>
        </div>
      </div>

      <p className="text-sm text-neutral-600 mt-8 text-center">
        Don’t have an account?{" "}
        <a href="/auth/register" className="text-black font-medium hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
}
