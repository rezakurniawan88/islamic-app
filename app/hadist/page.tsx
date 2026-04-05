"use client"

import Sidebar from "@/components/sidebar";
import { toArabicNumber } from "@/utils/arabic-number";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

type HadistType = {
    id: string
    name: string
    available: number
}

export default function HadistPage() {
    const { data: dataHadist, isLoading: isLoadingHadist } = useQuery({
        queryKey: ["hadist"],
        queryFn: async () => {
            const response = await axios.get("https://api.hadith.gading.dev/books");
            return Array.isArray(response?.data?.data) ? response.data.data : [];
        }
    });

    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="pt-20 pb-5 px-7 lg:px-10 sm:py-6 flex-1 overflow-auto">
                <div className="mb-8">
                    <h1 className="text-lg sm:text-2xl font-semibold text-teal-400">Hadist</h1>
                    <p className="text-xs sm:text-sm text-slate-500">Daftar kitab hadist dari berbagai perawi terpercaya.</p>
                </div>

                {isLoadingHadist ? (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="animate-spin">
                            <svg className="w-12 h-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                ) : dataHadist && Array.isArray(dataHadist) && dataHadist.length > 0 ?
                    (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2 sm:my-4">
                            {dataHadist.map((hadist: HadistType, index: number) => (
                                <Link href={`/hadist/lists/${hadist?.id}`} key={hadist?.id} className="flex items-center justify-between p-5 sm:p-6 bg-white rounded-lg border border-teal-100 hover:shadow-md transition-all duration-300 hover:border-teal-300">
                                    <div className="flex items-center gap-4">
                                        <h1 className="arabic flex items-center gap-1 text-2xl">
                                            <span className="ayah-number text-teal-400 text-4xl">
                                                {toArabicNumber(index + 1)}
                                            </span>
                                        </h1>
                                        <div>
                                            <h4 className="text-sm sm:text-base font-semibold text-slate-800">{hadist?.name}</h4>
                                        </div>
                                    </div>
                                    <p className="text-right text-xs text-slate-400">{hadist?.available} Hadist</p>
                                </Link>
                            ))}
                        </div>
                    ) : (<p className="text-center text-slate-500 mt-8">Tidak ada data Hadist yang tersedia.</p>)
                }
            </div>
        </div>
    )
}
