export default function DoaDetailSkeleton() {
    return (
        <div className="animate-pulse space-y-8">
            <div className="h-5 w-24 bg-teal-100 rounded-full" />
            <div className="space-y-3">
                <div className="h-8 w-3/4 bg-slate-100 rounded-lg" />
                <div className="h-5 w-1/3 bg-slate-100 rounded-full" />
            </div>
            <div className="bg-teal-50/60 rounded-3xl p-8 space-y-3">
                <div className="h-6 w-full bg-teal-100/80 rounded" />
                <div className="h-6 w-5/6 bg-teal-100/80 rounded" />
                <div className="h-6 w-4/6 bg-teal-100/80 rounded" />
            </div>
            <div className="space-y-3">
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-5/6 bg-slate-100 rounded" />
                <div className="h-4 w-4/5 bg-slate-100 rounded" />
            </div>
        </div>
    )
}
