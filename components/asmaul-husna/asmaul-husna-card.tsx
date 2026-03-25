interface AsmaulHusnaCardProps {
    latin: string;
    arabic: string;
    id: string;
    eng: string;
}

export default function AsmaulHusnaCard({ latin, arabic, id, eng }: AsmaulHusnaCardProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl px-5 py-9 border border-teal-200 hover:shadow-md hover:border-teal-300 group transition-all duration-300">
            <div className="text-center mb-3">
                <p className="text-3xl font-bold text-teal-500">{arabic}</p>
            </div>

            <div className="mb-3 text-center">
                <p className="text-sm font-semibold text-slate-800">{latin}</p>
            </div>

            <div className="mb-2 pb-2 text-center border-b border-slate-200">
                <p className="text-xs text-slate-600 font-medium">{id}</p>
            </div>

            <div>
                <p className="text-xs text-slate-500 text-center italic">{eng}</p>
            </div>
        </div>
    );
}