import type { HijriDay } from "@/hooks/useFetchIslamicCalendar";
import { useEffect, useRef } from "react";

interface DayDetailDialogProps {
    day: HijriDay;
    onClose: () => void;
}

export default function DayDetailDialog({ day, onClose }: DayDetailDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const gregorianDate = new Date(parseInt(day.gregorian.year), day.gregorian.month.number - 1, parseInt(day.gregorian.day));
    const gregorianDialogLabel = gregorianDate.toLocaleString("id-ID", {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center p-4">
            <div ref={dialogRef} className="bg-white rounded-2xl shadow-xl w-[90%] sm:w-full sm:max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-slate-800" aria-label="Close dialog">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">{gregorianDialogLabel}</h2>
                    <p className="text-xs sm:text-sm text-slate-500">{day.hijri.day} {day.hijri.month.en} {day.hijri.year} AH</p>
                </div>

                {day.hijri.holidays.length > 0 && (
                    <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-emerald-600 bg-emerald-50 px-3 py-2.5 mb-4 rounded-lg border border-emerald-100 w-full">
                        <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
                        <span className="truncate">{day.hijri.holidays[0]}</span>
                    </span>
                )}

                <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Jadwal Sholat</h3>
                    <ul className="space-y-2 sm:space-y-1.5 text-slate-600 text-xs sm:text-base">
                        <li className="flex justify-between"><span>Imsak</span> <span className="text-emerald-400">{day.prayers.Imsak.split(' ')[0]}</span></li>
                        <li className="flex justify-between"><span>Subuh</span> <span className="text-emerald-400">{day.prayers.Fajr.split(' ')[0]}</span></li>
                        <li className="flex justify-between"><span>Dzuhur</span> <span className="text-emerald-400">{day.prayers.Dhuhr.split(' ')[0]}</span></li>
                        <li className="flex justify-between"><span>Ashar</span> <span className="text-emerald-400">{day.prayers.Asr.split(' ')[0]}</span></li>
                        <li className="flex justify-between"><span>Maghrib</span> <span className="text-emerald-400">{day.prayers.Maghrib.split(' ')[0]}</span></li>
                        <li className="flex justify-between"><span>Isya</span> <span className="text-emerald-400">{day.prayers.Isha.split(' ')[0]}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
