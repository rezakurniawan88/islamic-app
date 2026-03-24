import HijriyahCalendar from "@/components/calendar/hijriyah-calendar";
import Sidebar from "@/components/sidebar";

export default function CalendarPage() {
    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="pt-20 pb-5 px-7 lg:px-10 sm:py-6 flex-1 overflow-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="text-lg sm:text-2xl font-semibold">Kalender Hijriyah</h1>
                    <p className="text-xs sm:text-sm text-slate-500">Lihat tanggal Hijriyah, hari libur, dan jadwal sholat harian.</p>
                </div>
                <HijriyahCalendar />
            </div>
        </div>
    );
}