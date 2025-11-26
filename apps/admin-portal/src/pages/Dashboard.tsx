export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/levels" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-blue-600">Manage Levels</h2>
          <p className="text-gray-600">HSK 1-6 Levels</p>
        </a>
        <a href="/lessons" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-green-600">Manage Lessons</h2>
          <p className="text-gray-600">Create & Organize Lessons</p>
        </a>
        <a href="/vocabularies" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-purple-600">Manage Vocabularies</h2>
          <p className="text-gray-600">Hanzi, Pinyin, Meaning</p>
        </a>
      </div>
    </div>
  );
}
