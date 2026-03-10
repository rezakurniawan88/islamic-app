"use client"

import { useState, useEffect } from "react"
import useFetchProvince from "@/hooks/useFetchProvince"
import useFetchCity from "@/hooks/useFetchCity"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import SelectLocation from "../select-location"

interface PrayerTime {
    name: string
    time: string
    icon: string
}

interface ScheduleDataType {
    tanggal: number
    tanggal_lengkap: string
    hari: string
    imsak: string
    subuh: string
    terbit: string
    dhuha: string
    dzuhur: string
    ashar: string
    maghrib: string
    isya: string
}

export default function PrayerTimePage() {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([
        { name: "Subuh", time: "--:--", icon: "🌙" },
        { name: "Dzuhur", time: "--:--", icon: "☀️" },
        { name: "Ashar", time: "--:--", icon: "🌤️" },
        { name: "Maghrib", time: "--:--", icon: "🌅" },
        { name: "Isya", time: "--:--", icon: "🌙" }
    ])

    const [nextPrayer, setNextPrayer] = useState<string>("-")
    const [nextPrayerIcon, setNextPrayerIcon] = useState<string>("🕌")
    const [timeRemaining, setTimeRemaining] = useState<string>("--:--")
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const { data: provincesData, isLoading: isProvincesLoading } = useFetchProvince();
    const { data: citiesData, isPending: isCitiesLoading } = useFetchCity({ selectedProvince });
    const date = new Date();
    const formattedMonth = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const formattedToday = date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const { data: scheduleData, isPending: isScheduleLoading } = useQuery({
        queryKey: ["get-schedule", selectedProvince, selectedCity],
        queryFn: async () => {
            const response = await axios.post("https://equran.id/api/v2/shalat", {
                provinsi: selectedProvince,
                kabkota: selectedCity,
            });
            return response?.data?.data?.jadwal;
        },
        enabled: !!selectedProvince && !!selectedCity,
    });

    useEffect(() => {
        if (scheduleData && scheduleData.length > 0) {
            const today = new Date();
            const todayDate = today.getDate();

            const todaySchedule = scheduleData.find((s: ScheduleDataType) => s.tanggal === todayDate) ?? scheduleData[0];

            const prayerData: PrayerTime[] = [
                { name: "Subuh", time: todaySchedule.subuh, icon: "🌙" },
                { name: "Dzuhur", time: todaySchedule.dzuhur, icon: "☀️" },
                { name: "Ashar", time: todaySchedule.ashar, icon: "🌤️" },
                { name: "Maghrib", time: todaySchedule.maghrib, icon: "🌅" },
                { name: "Isya", time: todaySchedule.isya, icon: "🌙" }
            ];
            setPrayerTimes(prayerData);

            const prayerLabels = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];
            const prayerIcons = ["🌙", "☀️", "🌤️", "🌅", "🌙"];
            const prayerTimesFromApi = [
                todaySchedule.subuh,
                todaySchedule.dzuhur,
                todaySchedule.ashar,
                todaySchedule.maghrib,
                todaySchedule.isya,
            ];

            const updateNextPrayer = () => {
                const now = new Date();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const currentTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

                let nextPrayerIndex = -1;
                for (let i = 0; i < prayerTimesFromApi.length; i++) {
                    if (currentTime < prayerTimesFromApi[i]) {
                        nextPrayerIndex = i;
                        break;
                    }
                }

                if (nextPrayerIndex === -1) {
                    nextPrayerIndex = 0;
                }

                setNextPrayer(prayerLabels[nextPrayerIndex]);
                setNextPrayerIcon(prayerIcons[nextPrayerIndex]);

                const nextPrayerTime = prayerTimesFromApi[nextPrayerIndex];
                const [nextHours, nextMinutes] = nextPrayerTime.split(":").map(Number);
                const nextDate = new Date();
                nextDate.setHours(nextHours, nextMinutes, 0, 0);

                if (nextDate <= now) {
                    nextDate.setDate(nextDate.getDate() + 1);
                }

                const diff = nextDate.getTime() - now.getTime();
                const hrs = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeRemaining(`${hrs}j ${mins}m ${secs}d`);
            };

            updateNextPrayer();
            const timer = setInterval(updateNextPrayer, 1000);

            return () => clearInterval(timer);
        }
    }, [scheduleData]);

    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        setSelectedCity("");
    };

    return (
        <div className="pt-20 pb-5 px-7 lg:px-10 sm:py-6 flex-1 overflow-auto">
            <div className="mb-5 sm:mb-8">
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Jadwal Shalat</h1>
                <p className="text-xs sm:text-sm text-slate-500">Pantau waktu shalat Anda dengan akurat</p>
            </div>

            <SelectLocation
                selectedProvince={selectedProvince}
                selectedCity={selectedCity}
                provincesData={provincesData}
                citiesData={citiesData}
                isProvincesLoading={isProvincesLoading}
                isCitiesLoading={isCitiesLoading}
                handleProvinceChange={handleProvinceChange}
                setSelectedCity={setSelectedCity}
            />

            <div className="mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
                    <h3 className="text-base sm:text-xl font-bold text-slate-900">Jadwal Hari Ini</h3>
                    <span className="bg-emerald-200 py-1 px-3 rounded-full text-[0.6rem] sm:text-[0.7rem] font-semibold text-emerald-600">{formattedToday}</span>
                </div>
                {!selectedCity ? (
                    <div className="bg-linear-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl p-5 sm:p-8 text-white shadow-lg border border-emerald-400/20">
                        <p className="text-sm font-medium opacity-90">Pilih lokasi terlebih dahulu</p>
                    </div>
                ) : isScheduleLoading ? (
                    <div className="bg-linear-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl p-5 sm:p-8 text-white shadow-lg border border-emerald-400/20 flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-emerald-200"></div>
                        <p className="text-sm font-medium">Memuat data...</p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-linear-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl p-6 sm:px-8 sm:py-6 text-white shadow-lg border border-emerald-400/20">
                        <div>
                            <p className="text-xs sm:text-sm font-medium opacity-90 mb-2">Shalat Berikutnya</p>
                            <h2 className="text-lg sm:text-2xl font-bold">{nextPrayerIcon} {nextPrayer}</h2>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium opacity-90 mb-2">Waktu tersisa</p>
                            <p className="text-lg sm:text-2xl font-semibold text-emerald-100">{timeRemaining}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-7 sm:mb-8">
                {prayerTimes.map((prayer, index) => (
                    <div key={index} className={`flex flex-col items-center justify-center rounded-xl p-5 sm:p-6 border border-emerald-200 hover:shadow-md transition-all duration-300 hover:border-emerald-300 group ${prayer.name === nextPrayer ? "bg-emerald-50 border-2 border-emerald-200 shadow-[0_0_3px_#34d399]" : "bg-white"}`}>
                        <div className="text-2xl sm:text-3xl mb-4 group-hover:scale-110 transition-transform">{prayer.icon}</div>
                        <h4 className="font-semibold text-slate-900 mb-1">{prayer.name}</h4>
                        <p className="text-xs text-slate-500 mb-2">Waktu shalat</p>
                        <p className="text-xl sm:text-2xl font-bold text-emerald-600">{prayer.time}</p>
                    </div>
                ))}
            </div>

            {selectedCity && (
                <div className="mb-8">
                    <div className="mb-6">
                        <h2 className="text-base sm:text-xl font-bold text-slate-900">Jadwal Shalat {formattedMonth}</h2>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">{selectedCity}, {selectedProvince}</p>
                    </div>

                    {isScheduleLoading ? (
                        <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
                            <div className="flex flex-col items-center gap-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-500"></div>
                                <p className="text-slate-600">Memuat jadwal shalat...</p>
                            </div>
                        </div>
                    ) : scheduleData && scheduleData.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-xs border border-emerald-200 overflow-hidden transition-all hover:shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-emerald-50 border-b border-slate-200 text-emerald-500 text-center text-xs sm:text-sm font-semibold whitespace-nowrap">
                                            <th className="p-4">Tanggal</th>
                                            <th className="p-4 text-left text-sm font-semibold whitespace-nowrap">Hari</th>
                                            <th className="p-4">Subuh</th>
                                            <th className="p-4">Terbit</th>
                                            <th className="p-4">Dhuha</th>
                                            <th className="p-4">Dzuhur</th>
                                            <th className="p-4">Ashar</th>
                                            <th className="p-4">Maghrib</th>
                                            <th className="p-4">Isya</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {scheduleData.map((schedule: ScheduleDataType, index: number) => (
                                            <tr key={index} className="text-xs sm:text-sm hover:bg-emerald-50/50 transition-colors duration-150">
                                                <td className="p-4 text-center font-semibold text-emerald-600">{schedule.tanggal}</td>
                                                <td className="p-4 font-semibold text-emerald-500">{schedule.hari}</td>
                                                <td className="p-4 text-center text-slate-700">{schedule.subuh}</td>
                                                <td className="p-4 text-center text-slate-700">{schedule.terbit}</td>
                                                <td className="p-4 text-center text-slate-700">{schedule.dhuha}</td>
                                                <td className="p-4 text-center text-slate-700">{schedule.dzuhur}</td>
                                                <td className="p-4 text-center text-slate-700">{schedule.ashar}</td>
                                                <td className="p-4 text-center text-slate-700">{schedule.maghrib}</td>
                                                <td className="p-4 text-center text-slate-700">{schedule.isya}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
                            <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 mx-auto mb-3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                <p className="text-slate-600 font-medium">Jadwal tidak tersedia</p>
                                <p className="text-slate-500 text-sm mt-1">Pilih provinsi dan kota untuk melihat jadwal shalat</p>
                            </div>
                        </div>
                    )}
                    <div className="bg-linear-to-br from-blue-50 to-blue-50/50 rounded-xl p-4 sm:p-6 border border-blue-200 mt-5">
                        <div className="flex items-center gap-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mt-1 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">Informasi Lokasi</h4>
                                <p className="text-xs text-blue-800">Waktu shalat ditampilkan berdasarkan lokasi yang Anda pilih. Pastikan lokasi Anda sudah sesuai untuk mendapatkan jadwal yang akurat.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}