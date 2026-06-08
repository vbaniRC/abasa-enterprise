export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-10 shadow-2xl">
        <h1 className="text-3xl font-semibold text-white text-center mb-8 tracking-tight">
          Sign in to your account
        </h1>

        <form className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-400 text-sm">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 text-white placeholder-neutral-600 border border-neutral-800 focus:outline-none focus:border-neutral-500 transition"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-400 text-sm">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 text-white placeholder-neutral-600 border border-neutral-800 focus:outline-none focus:border-neutral-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-neutral-500 text-sm text-center mt-8">
          Don’t have an account?{" "}
          <a href="/register" className="text-white underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
} 
