import Combobox from "./ui/combobox";

interface LocationOption {
    id: number;
    label: string;
    value: string;
}

interface SelectLocationProps {
    selectedProvince: string;
    selectedCity: string;
    provincesData: LocationOption[] | undefined;
    citiesData: LocationOption[] | undefined;
    isProvincesLoading: boolean;
    isCitiesLoading: boolean;
    handleProvinceChange: (value: string) => void;
    setSelectedCity: (value: string) => void;
}

export default function SelectLocation({ selectedProvince, selectedCity, provincesData, citiesData, isProvincesLoading, isCitiesLoading, handleProvinceChange, setSelectedCity }: SelectLocationProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xs border border-emerald-200 p-4 sm:p-5 mb-6 sm:mb-8 transition-all hover:shadow-sm">
            <h2 className="font-semibold text-sm sm:text-base text-slate-900">Pilih Lokasi</h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">Pilih provinsi dan kabupaten/kota untuk melihat jadwal.</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Combobox
                    label="Provinsi"
                    value={selectedProvince}
                    options={provincesData ?? []}
                    disabled={isProvincesLoading}
                    searchable
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                    }
                    onChange={(val) => handleProvinceChange(val)}
                />
                <Combobox
                    label="Kab/Kota"
                    value={selectedCity}
                    options={citiesData ?? []}
                    disabled={!selectedProvince || isCitiesLoading}
                    searchable
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    }
                    onChange={(val) => setSelectedCity(val)}
                />
            </div>
        </div>
    )
}