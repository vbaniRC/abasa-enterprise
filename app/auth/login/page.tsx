export default function LoginPage() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-10">
      <h1 className="text-xl font-semibold text-neutral-900 mb-8">
        Log in to Vercel
      </h1>

      <div className="space-y-4">

        {/* Continue with Email */}
        <button className="w-full border border-neutral-300 rounded-md py-2.5 text-sm font-medium hover:bg-neutral-50 transition">
          Continue with Email
        </button>

        {/* Continue with Google */}
        <button className="w-full border border-neutral-300 rounded-md py-2.5 text-sm font-medium hover:bg-neutral-50 transition flex items-center justify-center gap-2">
          <span>Continue with Google</span>
        </button>

        {/* Continue with GitHub */}
        <button className="w-full border border-neutral-300 rounded-md py-2.5 text-sm font-medium hover:bg-neutral-50 transition flex items-center justify-center gap-2">
          <span>Continue with GitHub</span>
        </button>

        {/* Continue with Apple */}
        <button className="w-full border border-neutral-300 rounded-md py-2.5 text-sm font-medium hover:bg-neutral-50 transition flex items-center justify-center gap-2">
          <span>Continue with Apple</span>
        </button>

        {/* Continue with SAML SSO */}
        <button className="w-full border border-neutral-300 rounded-md py-2.5 text-sm font-medium hover:bg-neutral-50 transition flex items-center justify-center gap-2">
          <span>Continue with SAML SSO</span>
        </button>

        {/* Continue with Passkey */}
        <button className="w-full border border-neutral-300 rounded-md py-2.5 text-sm font-medium hover:bg-neutral-50 transition flex items-center justify-center gap-2">
          <span>Continue with Passkey</span>
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
