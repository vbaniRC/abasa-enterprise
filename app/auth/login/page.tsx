export default function LoginPage() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-8">
      <h1 className="text-lg font-semibold text-neutral-900 mb-6">
        Sign in to your account
      </h1>

      <form className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">Password</label>
          <input
            type="password"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white rounded-md py-2 text-sm font-medium hover:bg-neutral-800 transition"
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
