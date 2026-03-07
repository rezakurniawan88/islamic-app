interface SearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function Search({ searchTerm, onSearchChange }: SearchProps) {
    return (
        <form className="mx-auto" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search" className="sr-only">Search</label>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                    </svg>
                </div>

                <input
                    type="search"
                    id="search"
                    placeholder="Cari surah berdasarkan nama atau nomor..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="block w-full p-3 pl-9 text-xs sm:text-sm text-gray-900 border border-slate-200 rounded-lg placeholder:text-xs sm:placeholder:text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
            </div>
        </form>
    )
}
