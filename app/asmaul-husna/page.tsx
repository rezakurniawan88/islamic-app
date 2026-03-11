import { data } from "@/utils/asmaul-husna-data";
import AsmaulHusnaCard from "@/components/asmaul-husna/asmaul-husna-card";
import Sidebar from "@/components/sidebar";

export default function AsmaulHusnaPage() {
    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="pt-20 pb-5 px-7 lg:px-10 sm:py-6 flex-1 overflow-auto">
                <div className="mb-8">
                    <h1 className="text-lg sm:text-2xl font-semibold">Asmaul Husna</h1>
                    <p className="text-xs sm:text-sm text-slate-500">Daftar 99 nama Allah yang paling mulia</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {data.map((item, index) => (
                        <AsmaulHusnaCard
                            key={index}
                            latin={item.latin}
                            arabic={item.arabic}
                            id={item.id}
                            eng={item.eng}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}