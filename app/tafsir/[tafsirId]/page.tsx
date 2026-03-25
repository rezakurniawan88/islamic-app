"use client"

import Sidebar from "@/components/sidebar";
import useFetchTafsir from "@/hooks/useFetchTafsir";
import { toArabicNumber } from "@/utils/arabic-number";
import Link from "next/link";
import { use, useState } from "react";

export default function TafsirDetailPage({ params }: { params: Promise<{ tafsirId: string }> }) {
    const { tafsirId } = use(params);
    const { data: tafsirDetail, isLoading, error } = useFetchTafsir(tafsirId);
    const [expandedAyat, setExpandedAyat] = useState<number | null>(null);

    const toggleAccordion = (ayatNumber: number) => {
        setExpandedAyat(expandedAyat === ayatNumber ? null : ayatNumber);
    };

    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="pt-20 pb-10 px-7 lg:px-10 sm:py-6 flex-1 overflow-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="animate-spin">
                            <svg className="w-12 h-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-red-500">Terjadi kesalahan saat memuat data</p>
                    </div>
                ) : tafsirDetail ? (
                    <div className="mx-0 sm:mx-5 mt-1">
                        <div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
                                <Link href="/">Home</Link>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                <span className="font-semibold cursor-pointer">Surah {tafsirDetail.namaLatin}</span>
                            </div>

                            <div className="flex items-center justify-between bg-linear-to-br from-teal-400 to-teal-500 rounded-xl p-6 sm:p-8 text-white shadow-lg">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl sm:text-2xl font-bold">{tafsirDetail.namaLatin}</h2>
                                        <span className="text-xs sm:text-sm font-medium opacity-90">({tafsirDetail.tempatTurun})</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium opacity-90">
                                        {tafsirDetail.arti} • {tafsirDetail.jumlahAyat} ayah
                                    </p>
                                </div>
                                <h1 className="arabic flex items-center gap-1">
                                    <span className="ayah-number text-4xl sm:text-5xl">
                                        {toArabicNumber(tafsirDetail.nomor ?? 0)}
                                    </span>
                                </h1>
                            </div>

                            <div className="mt-7 text-slate-500 leading-6 sm:leading-7 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: tafsirDetail.deskripsi }} />
                        </div>

                        <div className="flex items-center gap-3 my-6 sm:my-8">
                            <div className="flex-1 h-px bg-slate-100" />
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                            <div className="flex-1 h-px bg-slate-100" />
                        </div>

                        <div>
                            <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-6">Tafsir Ayat Per Ayat</h2>
                            <div className="space-y-3">
                                {tafsirDetail.tafsir.map((tafsir, index) => (
                                    <div key={index} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-xs transition-shadow">
                                        <button
                                            onClick={() => toggleAccordion(tafsir.ayat)}
                                            className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="inline-block bg-teal-100 text-teal-800 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[0.7rem] sm:text-xs font-semibold">Tafsir {tafsirDetail.namaLatin} Ayat {tafsir.ayat}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 text-teal-600 transition-transform duration-300 ${expandedAyat === tafsir.ayat ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
                                        </button>

                                        {expandedAyat === tafsir.ayat && (
                                            <div className="px-5 sm:px-7 py-3 sm:py-5 pb-5 sm:pb-6 border-t border-slate-200">
                                                <div className="text-slate-500 leading-7 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: tafsir.teks }} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}