"use client"

import Sidebar from "@/components/sidebar";
import AyahSkeleton from "@/components/skeleton/ayah-skeleton";
import HeaderAyahSkeleton from "@/components/skeleton/header-ayah-skeleton";
import Combobox, { QORI_OPTIONS, TRANSLATION_OPTIONS } from "@/components/ui/combobox";
import axiosInstance from "@/lib/axios";
import { toArabicNumber } from "@/utils/arabic-number";
import { useQuery } from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useLayoutEffect, useRef, useState } from "react";

interface AyahsData {
    number: number
    englishName: string
    englishNameTranslation: string
    arabic: string
    totalAyahs: number
    latin: string
    translation: string
    audio: string
}

interface AyahData {
    numberInSurah: number;
    text: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
}

export default function AyahPage({ params }: { params: Promise<{ ayahId: string }> }) {
    const { ayahId } = use(params);
    const router = useRouter();

    const [selectedTranslation, setSelectedTranslation] = useState<string>("id.indonesian");
    const [selectedQori, setSelectedQori] = useState<string>("ar.alafasy");

    const { data: allSurahs } = useQuery({
        queryKey: ["surah-list"],
        queryFn: async () => {
            const response = await axiosInstance.get("/surah");
            return response?.data?.data as { number: number, englishName: string, name: string }[];
        },
        staleTime: Infinity
    })

    const { data: surahDetail, isLoading } = useQuery({
        queryKey: ["surah", ayahId, selectedTranslation, selectedQori],
        queryFn: async () => {
            const response = await axiosInstance.get(
                `/surah/${ayahId}/editions/quran-uthmani,en.transliteration,${selectedTranslation},${selectedQori}`
            );
            return response?.data?.data;
        },
        enabled: !!ayahId,
    });

    const surah = surahDetail?.[0];
    const ayah = surahDetail?.[0]?.ayahs;
    const latin = surahDetail?.[1]?.ayahs;
    const translation = surahDetail?.[2]?.ayahs;
    const audio = surahDetail?.[3]?.ayahs;

    const ayahs: AyahsData[] = ayah?.map((ayah: AyahData, index: number) => ({
        number: ayah?.numberInSurah,
        arabic: ayah?.text,
        englishName: surah?.englishName,
        englishNameTranslation: surah?.englishNameTranslation,
        totalAyahs: surah?.numberOfAyahs,
        latin: latin?.[index]?.text,
        translation: translation?.[index]?.text,
        audio: audio?.[index]?.audio
    })) ?? [];

    const listRef = useRef<HTMLDivElement>(null);
    const [scrollMargin, setScrollMargin] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    useLayoutEffect(() => {
        if (listRef.current) {
            setScrollMargin(listRef.current.offsetTop);
        }
    }, [isLoading]);

    useLayoutEffect(() => {
        if (currentPlayingIndex !== null && ayahRefs.current[currentPlayingIndex]) {
            const element = ayahRefs.current[currentPlayingIndex];
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [currentPlayingIndex]);

    const virtualizer = useWindowVirtualizer({
        count: ayahs?.length,
        estimateSize: () => 180,
        overscan: 5,
        scrollMargin,
    });

    const firstAyah = ayahs?.[0];

    const surahOptions = allSurahs
        ? allSurahs.map((surah) => ({
            value: String(surah.number),
            label: `${surah.number}. ${surah.englishName} (${surah.name})`,
        }))
        : Array.from({ length: 114 }, (_, i) => ({
            value: String(i + 1),
            label: `${i + 1}. ${i + 1 === Number(ayahId) ? surah?.englishName ?? `Surah ${i + 1}` : `Surah ${i + 1}`}`,
        }));

    const playAyah = (index: number) => {
        const ayahData = ayahs?.[index];
        if (!ayahData?.audio) return;

        if (audioRef.current) {
            audioRef.current.src = ayahData.audio;
            audioRef.current.play();
            setCurrentPlayingIndex(index);
            setIsPlaying(true);
        }
    }

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setCurrentPlayingIndex(null);
    }

    const playNext = () => {
        if (currentPlayingIndex !== null && currentPlayingIndex < ayahs.length - 1) {
            playAyah(currentPlayingIndex + 1);
        } else {
            stopAudio();
        }
    }

    return (
        <div className="flex w-full">
            <Sidebar />
            <div className="px-3 sm:px-10 pt-20 pb-5 sm:py-7 w-full lg:px-14 flex-1 overflow-auto">
                {isLoading ? (
                    <>
                        <HeaderAyahSkeleton />
                        <div className="w-2/6 mx-auto flex items-center justify-between bg-slate-100 rounded-xl py-6 my-7"></div>
                        <div className="space-y-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <AyahSkeleton key={i} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mx-4 mb-4">
                            <Link href="/">Home</Link>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            <span className="font-semibold cursor-pointer">Surah {firstAyah?.englishName}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mx-4 mb-5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <Combobox
                                label="Surah"
                                value={ayahId}
                                options={surahOptions}
                                searchable
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                                }
                                onChange={(val) => { router.push(`/ayah/${val}`); }}
                            />

                            <Combobox
                                label="Terjemahan"
                                value={selectedTranslation}
                                options={TRANSLATION_OPTIONS}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
                                }
                                onChange={(val) => {
                                    stopAudio();
                                    setSelectedTranslation(val);
                                }}
                            />

                            <Combobox
                                label="Qori"
                                value={selectedQori}
                                options={QORI_OPTIONS}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v3" /></svg>
                                }
                                onChange={(val) => {
                                    stopAudio();
                                    setSelectedQori(val);
                                }}
                            />
                        </div>

                        <div className={`flex items-center justify-between bg-linear-to-br from-emerald-400 to-emerald-500 rounded-xl p-6 sm:p-8 mx-4 text-white shadow-lg ${ayahId === "1" || ayahId === "9" ? "mb-6" : ""}`}>
                            <div className="space-y-1">
                                <h2 className="text-xl sm:text-2xl font-bold">{firstAyah?.englishName}</h2>
                                <p className="text-xs sm:text-sm font-medium opacity-90">
                                    {firstAyah?.englishNameTranslation} • {firstAyah?.totalAyahs} ayah
                                </p>
                            </div>
                            <h1 className="arabic flex items-center gap-1">
                                <span className="ayah-number text-4xl sm:text-5xl">
                                    {toArabicNumber(firstAyah?.number ?? 0)}
                                </span>
                            </h1>
                        </div>

                        {Number(ayahId) !== 1 && Number(ayahId) !== 9 && (
                            <h1 className="text-3xl sm:text-5xl text-slate-800 py-7 sm:py-14 text-center">﷽</h1>
                        )}


                        <audio ref={audioRef} onEnded={playNext} />

                        <div
                            ref={listRef}
                            className="relative"
                            style={{ height: virtualizer.getTotalSize() }}
                        >
                            {virtualizer.getVirtualItems().map((virtualItem) => {
                                const currentAyah = ayahs[virtualItem.index];
                                const isCurrentPlaying = currentPlayingIndex === virtualItem.index && isPlaying;

                                return (
                                    <div
                                        key={virtualItem.key}
                                        data-index={virtualItem.index}
                                        ref={(el) => {
                                            virtualizer.measureElement(el);
                                            if (el) ayahRefs.current[virtualItem.index] = el;
                                        }}
                                        className={`absolute top-0 left-0 w-full px-4 ${isCurrentPlaying ? "bg-emerald-50 border-b border-slate-200" : ""}`}
                                        style={{ transform: `translateY(${virtualItem.start - scrollMargin}px)` }}
                                    >
                                        <div className={`py-4 sm:py-8 space-y-4 ${!isCurrentPlaying ? "border-b border-slate-200" : ""}`}>
                                            <h1 className="arabic flex items-center gap-1 text-2xl sm:text-4xl">
                                                {currentAyah?.arabic}
                                                <span className="ayah-number text-emerald-500 text-4xl">
                                                    {toArabicNumber(currentAyah?.number ?? 0)}
                                                </span>
                                            </h1>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => playAyah(virtualItem.index)}
                                                    disabled={!currentAyah?.audio}
                                                    className="px-2.5 sm:px-4 py-2 sm:py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {isCurrentPlaying ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><rect x="14" y="3" width="5" height="18" rx="1" /><rect x="5" y="3" width="5" height="18" rx="1" /></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg>
                                                    )}
                                                </button>
                                                {isCurrentPlaying && (
                                                    <button onClick={stopAudio} className="px-2.5 sm:px-4 py-2 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                            <div>
                                                <h1 className="italic text-emerald-400 font-semibold text-sm sm:text-base">
                                                    {currentAyah?.latin}
                                                </h1>
                                                <p className="translation text-xs sm:text-sm text-slate-700">
                                                    {currentAyah?.translation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}