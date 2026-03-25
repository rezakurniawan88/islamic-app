"use client"

import Sidebar from '@/components/sidebar'
import Search from '@/components/ui/search';
import useFetchSurah from '@/hooks/useFetchSurah';
import { toArabicNumber } from '@/utils/arabic-number';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type SurahItemType = {
    number: number
    name: string,
    englishName: string,
    englishNameTranslation: string,
    numberOfAyahs: number,
    revelationType: string
}

export default function TafsirPage() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { data: surahList, isLoading } = useFetchSurah();

    const filteredSurah = useMemo(() => {
        if (!surahList) return [];
        return surahList.filter((surah: SurahItemType) =>
            surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.number.toString().includes(searchTerm)
        );
    }, [surahList, searchTerm]);

    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="pt-20 pb-10 px-7 lg:px-10 sm:py-6 flex-1 overflow-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="text-lg sm:text-2xl font-semibold tracking-tight">Tafsir</h1>
                    <p className="text-sm text-slate-400 mt-1">Menjelaskan ayat-ayat Al-Qur&apos;an dengan tafsir yang mendalam.</p>
                </div>
                <div className="pb-5 space-y-3">
                    <h1 className="text-sm sm:text-base font-semibold text-gray-500">Cari Surat</h1>
                    <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                </div>


                {isLoading ? (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="animate-spin">
                            <svg className="w-12 h-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                    <Link href={`/tafsir/${surah?.number}`} key={index} className="flex items-center justify-between p-5 sm:p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all duration-300 hover:border-teal-300">
                                        <div className="flex items-center gap-4">
                                            <h1 className="arabic flex items-center gap-1 text-2xl">
                                                <span className="ayah-number text-teal-400 text-4xl">
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
        </div>
    )
}
