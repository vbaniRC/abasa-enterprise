export default function DashboardPage() {
  return (
    <div className="space-y-10">

      {/* HERO SECTION */}
      <div>
        <h1 className="text-4xl font-bold">Dobrodošli u ABASA Sport</h1>
        <p className="text-gray-600 mt-2">
          Pregled ključnih informacija o vašem klubu.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold">Ukupno članova</h3>
          <p className="text-3xl font-bold mt-2">128</p>
          <p className="text-sm text-gray-500 mt-1">Aktivni i registrirani</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold">Treneri</h3>
          <p className="text-3xl font-bold mt-2">6</p>
          <p className="text-sm text-gray-500 mt-1">Licencirani treneri</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold">Grupe</h3>
          <p className="text-3xl font-bold mt-2">12</p>
          <p className="text-sm text-gray-500 mt-1">Aktivne trenažne grupe</p>
        </div>

      </div>

      {/* QUICK LINKS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Brzi linkovi</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <a
            href="/users"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            Upravljanje članovima →
          </a>

          <a
            href="/club"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            Informacije o klubu →
          </a>

          <a
            href="/settings"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            Postavke sustava →
          </a>

        </div>
      </div>

    </div>
  );
}
