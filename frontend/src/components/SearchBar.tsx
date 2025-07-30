import { Search } from "lucide-react";
export default function SearchBar() {
  return (
    <div className="bg-black flex items-center border border-gray-600 rounded-md px-4 py-2 w-full max-w-lg focus-within:border-white transition">
      <input
        type="text"
        placeholder="Buscar por..."
        className="bg-transparent text-white placeholder-gray-400 flex-grow focus:outline-none"
      />
      <button
        type="button"
        className="ml-2 p-1 hover:bg-gray-800 rounded-md transition"
        onClick={() => {}} //implementar logica
      >
        <Search className="text-gray-400" size={18} />
      </button>
    </div>
  );
}
