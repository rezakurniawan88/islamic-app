"use client"

import HadithCard from "@/components/hadist/hadist-card";
import Sidebar from "@/components/sidebar";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { use, useEffect, useRef } from "react";

type HadistListType = {
    number: number
    arab: string
    id: string
}

export default function HadistListPage({ params }: { params: Promise<{ hadistId: string }> }) {
    const { hadistId } = use(params);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const PAGE_SIZE = 20;

    const { data: dataHadist, isLoading: isLoadingHadist, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["hadist-list", hadistId],
        queryFn: async ({ pageParam = 1 }) => {
            const start = (pageParam - 1) * PAGE_SIZE + 1;
            const end = pageParam * PAGE_SIZE;
            const response = await axios.get(`https://api.hadith.gading.dev/books/${hadistId}?range=${start}-${end}`);
            return response?.data?.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.length * PAGE_SIZE;
            return totalFetched < lastPage.available ? allPages.length + 1 : undefined;
        },
        enabled: !!hadistId,
    });

    const bookMetadata = dataHadist?.pages[0];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="pt-20 pb-5 px-7 lg:px-10 sm:py-6 flex-1 overflow-auto">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-4">
                    <Link href="/hadist">Hadist</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    <span className="font-semibold cursor-pointer hover:text-teal-600 transition-colors duration-200">Hadist List</span>
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
                ) : (
                    <>
                        <div className="mb-5 sm:mb-8">
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg sm:text-2xl font-semibold tracking-tight text-teal-400">{bookMetadata?.name}</h1>
                                <span className="text-base sm:text-xl font-semibold tracking-tight text-teal-400">{` (${bookMetadata?.available} hadist)`}</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">Temukan hadist yang Anda butuhkan.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 my-2 sm:my-4">
                            {dataHadist?.pages.map((page) =>
                                page.hadiths.map((item: HadistListType) => {
                                    const dataHadist = {
                                        hadistBook: page.name,
                                        ...item
                                    }
                                    return <HadithCard key={`${page.id}-${item.number}`} hadith={dataHadist} />
                                })
                            )}
                        </div>

                        <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-4">
                            {isFetchingNextPage && (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                            )}
                            {!hasNextPage && (
                                <p className="text-slate-400 text-sm italic">Semua hadist telah dimuat.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
