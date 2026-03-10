"use client"

import SelectLocation from "@/components/select-location";
import Sidebar from "@/components/sidebar";
import useFetchCity from "@/hooks/useFetchCity";
import useFetchProvince from "@/hooks/useFetchProvince";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface ScheduleDataType {
    tanggal: number
    imsak: string
    subuh: string
    terbit: string
    dhuha: string
    dzuhur: string
    ashar: string
    maghrib: string
    isya: string
}

export default function ImsakiyahPage() {
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const { data: provincesData, isLoading: isProvincesLoading } = useFetchProvince();
    const { data: citiesData, isPending: isCitiesLoading } = useFetchCity({ selectedProvince });
    console.log("province", provincesData);


    const { data: scheduleData, isPending: isScheduleLoading } = useQuery({
        queryKey: ["get-schedule", selectedProvince, selectedCity],
        queryFn: async () => {
            const response = await axios.post("https://equran.id/api/v2/imsakiyah", {
                provinsi: selectedProvince,
                kabkota: selectedCity,
            });
            return response?.data?.data?.imsakiyah;
        },
        enabled: !!selectedProvince && !!selectedCity,
    });

    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        setSelectedCity("");
    };

    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="pt-20 pb-5 px-7 lg:px-10 sm:py-6 flex-1 overflow-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="text-lg sm:text-2xl font-semibold">Imsakiyah</h1>
                    <p className="text-xs sm:text-sm text-slate-500">Periksa jadwal imsak dan iftar di daerah Anda.</p>
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

                {selectedCity && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-base sm:text-xl font-semibold text-slate-900">Jadwal Imsakiyah</h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">{selectedCity}</p>
                        </div>

                        {isScheduleLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                            </div>
                        ) : scheduleData && scheduleData.length > 0 ? (
                            <div className="bg-white rounded-lg shadow-xs border border-emerald-200 overflow-hidden transition-all hover:shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-emerald-50 border-b border-slate-200 text-emerald-500 text-center text-xs sm:text-sm font-semibold whitespace-nowrap">
                                                <th className="p-4 text-center">Tanggal</th>
                                                <th className="p-4 text-left">Imsak</th>
                                                <th className="p-4 text-left">Subuh</th>
                                                <th className="p-4 text-left">Terbit</th>
                                                <th className="p-4 text-left">Dhuha</th>
                                                <th className="p-4 text-left">Dzuhur</th>
                                                <th className="p-4 text-left">Ashar</th>
                                                <th className="p-4 text-left">Maghrib</th>
                                                <th className="p-4 text-left">Isya</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {scheduleData.map((schedule: ScheduleDataType, index: number) => (
                                                <tr key={index} className="text-xs sm:text-sm hover:bg-slate-50 transition-colors duration-150">
                                                    <td className="p-4 text-center font-semibold text-emerald-600">{schedule.tanggal}</td>
                                                    <td className="p-4 font-semibold text-emerald-500">{schedule.imsak}</td>
                                                    <td className="p-4 text-slate-700">{schedule.subuh}</td>
                                                    <td className="p-4 text-slate-700">{schedule.terbit}</td>
                                                    <td className="p-4 text-slate-700">{schedule.dhuha}</td>
                                                    <td className="p-4 text-slate-700">{schedule.dzuhur}</td>
                                                    <td className="p-4 text-slate-700">{schedule.ashar}</td>
                                                    <td className="p-4 font-semibold text-emerald-500">{schedule.maghrib}</td>
                                                    <td className="p-4 text-slate-700">{schedule.isya}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-12 bg-white rounded-2xl border border-emerald-200">
                                <p className="text-slate-500">Data jadwal tidak tersedia</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}