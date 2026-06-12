"use client";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Build. Automate. Scale.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl">
          ABASA is your blueprint for modular club management, automation and operational clarity.
        </p>

        <div className="mt-10 flex gap-4">
          <a
            href="/auth/register"
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Get Started
          </a>

          <a
            href="/auth/login"
            className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-900 transition"
          >
            Login
          </a>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-24 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-3">Modular Architecture</h3>
            <p className="text-gray-400">
              Your club, your structure — ABASA adapts to any workflow.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Automation First</h3>
            <p className="text-gray-400">
              Reduce manual work. Increase clarity. Eliminate chaos.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Enterprise Reliability</h3>
            <p className="text-gray-400">
              Swiss‑grade stability for clubs that take operations seriously.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 className="text-3xl font-bold mb-4">Unified Dashboard</h2>
            <p className="text-gray-400">
              One place for members, coaches, parents, payments, attendance and notifications.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Automation Engine</h2>
            <p className="text-gray-400">
              Schedules, reminders, attendance flows — fully automated.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Multi‑Role Access</h2>
            <p className="text-gray-400">
              Admin, coach, parent, member — each with their own view.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Secure by Design</h2>
            <p className="text-gray-400">
              Supabase auth, RLS, encrypted storage and audit logs.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-gray-800 text-center text-gray-500">
        <p>ABASA — Blueprint Software & System Automation</p>
        <p className="mt-2">© 2026 a-basa.com</p>
      </footer>
    </main>
  );
}
