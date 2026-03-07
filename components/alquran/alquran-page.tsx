"use client"

import { useQuery } from "@tanstack/react-query";
import Search from "../ui/search";
import Link from "next/link";
import { toArabicNumber } from "@/utils/arabic-number";
import { useState, useMemo } from "react";
import axiosInstance from "@/lib/axios";

type SurahItemType = {
    number: number
    name: string,
    englishName: string,
    englishNameTranslation: string,
    numberOfAyahs: number,
    revelationType: string
}

export default function AlquranPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: surahList, isLoading } = useQuery({
        queryKey: ["surah-list"],
        queryFn: async () => {
            const response = await axiosInstance.get("/surah");
            return response?.data?.data
        },
        staleTime: Infinity
    });

    const filteredSurah = useMemo(() => {
        if (!surahList) return [];
        return surahList.filter((surah: SurahItemType) =>
            surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.number.toString().includes(searchTerm)
        );
    }, [surahList, searchTerm]);

    return (
        <div className="px-7 sm:px-14 py-5 sm:py-7 flex-1 overflow-auto">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold">Al-Qur&apos;an</h1>
                <p className="text-xs sm:text-sm text-slate-400">Pilih dan baca surat yang ingin Anda cari di sini.</p>
            </div>
            <div className="py-5 space-y-3">
                <h1 className="text-sm sm:text-base font-semibold text-gray-500">Cari Surat</h1>
                <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-96">
                    <div className="animate-spin">
                        <svg className="w-12 h-12 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            ) : (
                <div className="py-0 sm:py-2">
                    <h1 className="text-base sm:text-lg font-semibold text-gray-500">Daftar Surat</h1>
                    {filteredSurah.length === 0 ? (
                        <div className="flex items-center justify-center min-h-96">
                            <p className="text-gray-400">No surahs found matching &quot;{searchTerm}&quot;</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2 sm:my-4">
                            {filteredSurah?.map((surah: SurahItemType, index: number) => (
                                <Link href={`/ayah/${surah?.number}`} key={index} className="flex items-center justify-between p-5 sm:p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                    <div className="flex items-center gap-4">
                                        <h1 className="arabic flex items-center gap-1 text-2xl">
                                            <span className="ayah-number text-emerald-400 text-4xl">
                                                {toArabicNumber(surah?.number)}
                                            </span>
                                        </h1>
                                        <div>
                                            <h4 className="text-sm sm:text-base font-semibold text-slate-800">{surah?.englishName}</h4>
                                            <p className="text-xs text-slate-500">{surah?.englishNameTranslation}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-semibold">{surah?.revelationType}</p>
                                        <p className="text-xs text-slate-400">{surah?.numberOfAyahs} Ayat</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
