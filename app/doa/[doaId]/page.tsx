"use client"

import { use, useMemo } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import useFetchDua from "@/hooks/useFetchDua";
import DoaDetailSkeleton from "@/components/skeleton/doa-detail-skeleton";

type DoaTypeProps = {
    id: string;
    nama: string;
    idn: string;
    grup: string;
    tag?: string[];
}

export default function DoaDetailPage({ params }: { params: Promise<{ doaId: string }> }) {
    const { doaId } = use(params);
    const { data: doaList, isLoading } = useFetchDua();
    const doa = useMemo(() => doaList?.find((d: DoaTypeProps) => String(d.id) === String(doaId)), [doaList, doaId]);

    return (
        <div className="flex w-full min-h-screen bg-slate-50/50">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="mx-auto pt-20 sm:pt-8 pb-16 px-6 sm:px-14">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-teal-600 
                                   transition-colors duration-200 mb-4">
                        <Link href="/">Home</Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        <span className="font-semibold cursor-pointer">Doa Detail</span>
                    </div>

                    {isLoading ? (
                        <DoaDetailSkeleton />
                    ) : !doa ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-slate-500 font-medium">Doa tidak ditemukan</p>
                            <p className="text-sm text-slate-400 mt-1">Coba kembali ke halaman doa harian</p>
                        </div>
                    ) : (
                        <article className="space-y-5 sm:space-y-8">
                            <header className="space-y-4 sm:space-y-5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                                        {doa.grup}
                                    </span>
                                    {doa.tag?.slice(0, 3).map((t: string) => (
                                        <span key={t} className="text-xs text-slate-400 bg-white px-2.5 py-0.5 rounded-full border border-slate-100">{t}</span>
                                    ))}
                                </div>
                                <h1 className="text-lg sm:text-2xl font-semibold text-slate-800 leading-snug tracking-tight">{doa.nama}</h1>
                            </header>

                            <div className="relative bg-linear-to-br from-teal-50 to-teal-50/40 rounded-3xl p-7 sm:p-10 border border-teal-100/80 overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.06]">
                                    <svg viewBox="0 0 100 100" fill="currentColor" className="text-teal-600 w-full h-full">
                                        <path d="M100 0 Q60 0 0 60 L0 100 Q40 100 100 40 Z" />
                                    </svg>
                                </div>

                                <p className="text-right text-xl sm:text-3xl leading-[2.2] font-arabic text-slate-800  tracking-wide relative z-10" dir="rtl" lang="ar">{doa.ar}</p>
                            </div>

                            {doa.tr && (
                                <div className="px-1">
                                    <p className="text-sm sm:text-base text-teal-700/80 italic leading-relaxed font-medium">{doa.tr}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-slate-100" />
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-300" />
                                <div className="flex-1 h-px bg-slate-100" />
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">Terjemahan</p>
                                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{doa.idn}</p>
                            </div>

                            {doa.tentang && (
                                <div className="bg-white rounded-2xl border border-slate-100 p-5 flex gap-4">
                                    <div className="shrink-0 mt-0.5">
                                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 
                                                        flex items-center justify-center">
                                            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Keterangan</p>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{doa.tentang}</p>
                                    </div>
                                </div>
                            )}

                        </article>
                    )}
                </div>
            </div>
        </div>
    );
}