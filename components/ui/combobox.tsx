import { useLayoutEffect, useRef, useState } from "react";

export const TRANSLATION_OPTIONS = [
    { value: "id.indonesian", label: "Indonesia" },
    { value: "en.sahih", label: "English" },
];

export const QORI_OPTIONS = [
    { value: "ar.alafasy", label: "Mishary Alafasy" },
    { value: "ar.abdullahbasfar", label: "Abdullah Basfar" },
    { value: "ar.abdurrahmaansudais", label: "Abdurrahmaan As-Sudais" },
    { value: "ar.husary", label: "Mahmoud Khalil Al-Husary" },
    { value: "ar.minshawi", label: "Mohamed Siddiq El-Minshawi" },
];

interface ComboboxProps {
    label: string;
    value: string;
    options: { value: string, label: string }[];
    disabled?: boolean;
    onChange: (value: string) => void;
    icon: React.ReactNode;
    searchable?: boolean;
};

export default function Combobox({ label, value, options, disabled, onChange, icon, searchable = false }: ComboboxProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find(option => option.value === value);
    const filtered = searchable ? options.filter(option => option.label.toLowerCase().includes(search.toLowerCase())) : options;

    useLayoutEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("")
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                disabled={disabled}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-emerald-200 rounded-lg text-xs sm:text-sm text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 transition-all min-w-48 justify-between"
            >
                <span className="flex items-center gap-2 truncate">
                    {icon}
                    <span className="text-emerald-600 shrink-0">{label}:</span>
                    <span className="font-medium text-slate-600 truncate">{selected?.label ?? "—"}</span>
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`text-emerald-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {open && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-xl min-w-55 overflow-hidden">
                    {searchable && (
                        <div className="p-2 border-b border-slate-100">
                            <input
                                autoFocus
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari ..."
                                className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-400"
                            />
                        </div>
                    )}
                    <ul className="max-h-56 overflow-y-auto py-1">
                        {filtered.length === 0 && (
                            <li className="px-4 py-3 text-sm text-slate-400 text-center">Tidak ditemukan</li>
                        )}
                        {filtered.map(opt => (
                            <li key={opt.value}>
                                <button
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors flex items-center justify-between gap-2
                                        ${opt.value === value
                                            ? "bg-emerald-50 text-emerald-700 font-medium"
                                            : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    {opt.label}
                                    {opt.value === value && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}