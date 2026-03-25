"use client"

import Sidebar from "@/components/sidebar";
import DoaSkeleton from "@/components/skeleton/doa-skeleton";
import Combobox from "@/components/ui/combobox";
import useFetchDua from "@/hooks/useFetchDua";
import Link from "next/link";
import { useState } from "react";

type DoaTypeProps = {
    id: string;
    nama: string;
    idn: string;
    grup: string;
    tag?: string[];
}

export default function DoaPage() {
    const { data: doaList, isLoading: isDoaLoading } = useFetchDua();
    const groups = Array.from(new Set(doaList?.map((doa: DoaTypeProps) => doa.grup) || [])) as string[];
    const tags = Array.from(new Set(doaList?.flatMap((doa: DoaTypeProps) => doa.tag || []) || [])) as string[];
    const [selectedGroup, setSelectedGroup] = useState<string>("");
    const [selectedTag, setSelectedTag] = useState<string>("");
    const filteredDoaList = doaList?.filter((doa: DoaTypeProps) => {
        const matchGroup = !selectedGroup || doa.grup === selectedGroup;
        const matchTag = !selectedTag || doa.tag?.includes(selectedTag);
        return matchGroup && matchTag;
    });

    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="pt-20 pb-10 px-7 lg:px-10 sm:py-6 flex-1 overflow-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="text-lg sm:text-2xl font-semibold tracking-tight">Doa Harian</h1>
                    <p className="text-sm text-slate-400 mt-1">Temukan doa yang Anda butuhkan.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <Combobox
                        label="Grup"
                        value={selectedGroup}
                        options={groups.map(g => ({ value: g, label: g }))}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500 rotate-45"><path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z" /><path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z" /><path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z" /><path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z" /></svg>
                        }
                        onChange={setSelectedGroup}
                    />
                    <Combobox
                        label="Tag"
                        value={selectedTag}
                        options={tags.map(t => ({ value: t, label: t }))}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></svg>
                        }
                        onChange={setSelectedTag}
                        searchable={true}
                    />
                </div>



                {isDoaLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <DoaSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredDoaList?.map((doa: DoaTypeProps) => (
                            <Link href={`/doa/${doa.id}`} passHref
                                key={doa.id}
                                className="group relative bg-white rounded-2xl border border-teal-100 p-6 
                                           hover:border-teal-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] 
                                           transition-all duration-300 cursor-pointer overflow-hidden">
                                <div className="mb-4">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide 
                                                     text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                                        {doa.grup}
                                    </span>
                                </div>

                                <h2 className="text-base font-semibold text-slate-800 mb-3 line-clamp-2 
                                               group-hover:text-teal-700 transition-colors duration-200 leading-snug">
                                    {doa.nama}
                                </h2>

                                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
                                    {doa.idn}
                                </p>

                                <div className="flex items-end justify-between gap-2 mt-auto pt-3 border-t border-slate-100">
                                    <div className="flex flex-wrap gap-1.5">
                                        {doa.tag?.slice(0, 3).map((t: string) => (
                                            <span key={t} className="text-xs text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">{t}</span>
                                        ))}
                                    </div>
                                    <div className="shrink-0 w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center 
                                                    group-hover:bg-teal-50 transition-colors duration-200">
                                        <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-500 
                                                        transition-all duration-200 group-hover:translate-x-0.5"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}