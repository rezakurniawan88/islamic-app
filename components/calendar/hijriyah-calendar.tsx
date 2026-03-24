"use client";

import { useState, useMemo } from "react";
import {
    useFetchIslamicCalendar,
    type HijriDay,
} from "@/hooks/useFetchIslamicCalendar";
import DayDetailDialog from "./day-detail-dialog";

export default function HijriyahCalendar() {
    const [gregorianMonth, setGregorianMonth] = useState(new Date().getMonth() + 1);
    const [gregorianYear, setGregorianYear] = useState(new Date().getFullYear());
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState<HijriDay | null>(null);

    const { data: calendarData, isLoading, isError } = useFetchIslamicCalendar(
        gregorianMonth,
        gregorianYear,
        "Yogyakarta",
    );

    const handlePrevMonth = () => {
        if (gregorianMonth === 1) {
            setGregorianMonth(12);
            setGregorianYear(gregorianYear - 1);
        } else {
            setGregorianMonth(gregorianMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (gregorianMonth === 12) {
            setGregorianMonth(1);
            setGregorianYear(gregorianYear + 1);
        } else {
            setGregorianMonth(gregorianMonth + 1);
        }
    };

    const handleDayClick = (day: HijriDay | null) => {
        if (day) {
            setSelectedDay(day);
        }
    };

    const handleCloseDialog = () => {
        setSelectedDay(null);
    };

    const calendarWeeks = useMemo(() => {
        if (!calendarData || calendarData.length === 0) return [];

        const firstDayOfMonth = new Date(gregorianYear, gregorianMonth - 1, 1);
        const firstDay = firstDayOfMonth.getDay();

        if (isNaN(firstDay) || firstDay < 0 || firstDay > 6) return [];

        const weeks: (HijriDay | null)[][] = [];
        let currentWeek: (HijriDay | null)[] = new Array(firstDay).fill(null);

        calendarData.forEach((day) => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) currentWeek.push(null);
            weeks.push(currentWeek);
        }

        return weeks;
    }, [calendarData, gregorianMonth, gregorianYear]);

    const isToday = (day: HijriDay | null) => {
        if (!day) return false;
        return (
            day.gregorian.day === today.getDate().toString() &&
            gregorianMonth === today.getMonth() + 1 &&
            gregorianYear === today.getFullYear()
        );
    };

    if (isLoading)
        return (
            <div className="border border-slate-100 rounded-2xl p-8 bg-slate-50">
                <div className="text-center py-12">
                    <div className="inline-block">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-4 text-slate-600 font-medium">Memuat kalender...</p>
                </div>
            </div>
        );

    if (isError || !calendarData)
        return (
            <div className="border border-red-200 rounded-2xl p-8 bg-red-50">
                <div className="text-center py-12">
                    <p className="text-red-600 font-semibold">Gagal memuat kalender</p>
                </div>
            </div>
        );

    const gregorianHeaderLabel = new Date(gregorianYear, gregorianMonth - 1, 1).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <>
            {selectedDay && (
                <DayDetailDialog day={selectedDay} onClose={handleCloseDialog} />
            )}
            <div className="border border-slate-100 rounded-2xl p-4 sm:p-6 bg-white shadow-xs hover:shadow-sm transition-shadow duration-300">
                <div className="mb-4 sm:mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg sm:text-2xl font-bold text-slate-900">{gregorianHeaderLabel}</h2>
                        <div className="flex gap-1.5">
                            <button onClick={handlePrevMonth} className="p-2 sm:p-2.5 rounded-full bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 shadow-sm hover:shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-700"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            <button onClick={handleNextMonth} className="p-2 sm:p-2.5 rounded-full bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 shadow-sm hover:shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-700"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden">
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
                        {["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((day) => (
                            <div key={day} className="p-1 sm:p-3">
                                <span className="block sm:hidden text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider">
                                    {day.substring(0, 3)}
                                </span>
                                <span className="hidden sm:block text-xs font-bold text-slate-500 uppercase tracking-wider">{day}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        {calendarWeeks.map((week, weekIdx) => (
                            <div key={weekIdx} className="grid grid-cols-7 gap-1 sm:gap-2">
                                {week.map((day, dayIdx) => {
                                    const isTodayDate = isToday(day);
                                    const hasHoliday = (day?.hijri?.holidays?.length ?? 0) > 0;

                                    return (
                                        <div
                                            key={dayIdx}
                                            onClick={() => handleDayClick(day)}
                                            className={`
                                            p-1.5 sm:px-3 sm:py-4 min-h-20 sm:min-h-28 rounded-lg sm:rounded-xl transition-all duration-200 ${day ? "cursor-pointer" : ""
                                                }
                                            ${day ? isTodayDate
                                                    ? "bg-emerald-300 border border-emerald-200 hover:shadow-md hover:from-emerald-100 hover:to-emerald-100"
                                                    : "bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md hover:bg-emerald-50"
                                                    : "bg-slate-50"
                                                }
                                        `}
                                        >
                                            {day ? (
                                                <div className="flex flex-col h-full">
                                                    <div className="flex flex-wrap items-center gap-1 mb-1 sm:mb-2">
                                                        <span className={`text-sm sm:text-base font-bold ${isTodayDate ? "text-white" : "text-slate-900"}`}>
                                                            {day.gregorian.day}
                                                        </span>
                                                    </div>

                                                    <span className={`text-[0.6rem] sm:text-[0.7rem] font-medium leading-tight mb-1 sm:mb-2 line-clamp-2 ${isTodayDate ? "text-white font-semibold" : "text-slate-500"}`}>
                                                        {day.hijri.day} {day.hijri.month.en} {day.hijri.year}
                                                    </span>

                                                    {hasHoliday && (
                                                        <div className="mt-auto">
                                                            <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[0.6rem] sm:text-[11px] font-medium tracking-wide text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-emerald-100 w-full">
                                                                <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
                                                                <span className="truncate">{day.hijri.holidays[0]}</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}