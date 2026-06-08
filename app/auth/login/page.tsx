export default function LoginPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
      <h1 className="text-xl font-semibold text-neutral-900 mb-6">
        Sign in to your account
      </h1>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-neutral-800 transition"
        >
          Sign In
        </button>
      </form>

      <p className="text-sm text-neutral-600 mt-6 text-center">
        Don’t have an account?{" "}
        <a href="/auth/register" className="text-black font-medium hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
