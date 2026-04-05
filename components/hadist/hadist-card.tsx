type HadithsItemType = {
    number: number
    hadistBook: string
    arab: string
    id: string
}

const HadithCard = ({ hadith }: { hadith: HadithsItemType }) => {
    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 mb-4">
            <div className="flex justify-between items-center mb-6">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm">{hadith?.number}</span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{hadith?.hadistBook}</span>
            </div>

            <p className="text-right text-xl sm:text-3xl leading-[2.2] font-arabic text-slate-800  tracking-wide" dir="rtl" lang="ar">{hadith?.arab}</p>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base mt-4">{hadith?.id}</p>
        </div>
    );
};

export default HadithCard;