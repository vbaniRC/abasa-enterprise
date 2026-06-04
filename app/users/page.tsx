export default function UsersPage() {
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">Članovi</h1>
        <p className="text-gray-600 mt-2">
          Pregled svih registriranih članova kluba.
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Ime i prezime</th>
              <th className="p-4 font-semibold text-gray-700">Email</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
              <th className="p-4 font-semibold text-gray-700">Akcije</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4">Marko Horvat</td>
              <td className="p-4">marko@example.com</td>
              <td className="p-4">
                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                  Aktivan
                </span>
              </td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline">Detalji</button>
              </td>
            </tr>

            <tr className="border-b hover:bg-gray-50">
              <td className="p-4">Ana Kovač</td>
              <td className="p-4">ana@example.com</td>
              <td className="p-4">
                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full">
                  Na čekanju
                </span>
              </td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline">Detalji</button>
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-4">Ivan Marić</td>
              <td className="p-4">ivan@example.com</td>
              <td className="p-4">
                <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full">
                  Neaktivan
                </span>
              </td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline">Detalji</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
