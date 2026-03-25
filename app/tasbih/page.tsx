"use client"

import Sidebar from "@/components/sidebar";
import { useState } from "react";

interface Dzikir {
    name: string;
    color: string;
    textColor: string;
}

const DZIKIR_LIST: Dzikir[] = [
    { name: "Subhanallah", color: "from-green-400 to-teal-500", textColor: "text-teal-500" },
    { name: "Alhamdullilah", color: "from-blue-400 to-cyan-500", textColor: "text-cyan-500" },
    { name: "Allahu Akbar", color: "from-purple-400 to-indigo-500", textColor: "text-indigo-500" }
];

const MAX_COUNT = 33;

export default function TasbihPage() {
    const [started, setStarted] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0);
    const [dzikirIndex, setDzikirIndex] = useState<number>(0);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    const currentDzikir = DZIKIR_LIST[dzikirIndex];

    const handleCounter = () => {
        if (counter < MAX_COUNT - 1) {
            setCounter(counter + 1);
        } else if (dzikirIndex < DZIKIR_LIST.length - 1) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCounter(0);
                setDzikirIndex(dzikirIndex + 1);
                setIsTransitioning(false);
            }, 500);
        } else {
            setIsComplete(true);
        }
    };

    const handleReset = () => {
        setStarted(false);
        setCounter(0);
        setDzikirIndex(0);
        setIsComplete(false);
    };

    const progress = ((dzikirIndex * MAX_COUNT + counter) / (DZIKIR_LIST.length * MAX_COUNT)) * 100;

    return (
        <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="pt-20 pb-5 px-7 lg:px-10 sm:py-6 flex-1 overflow-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="text-lg sm:text-2xl font-semibold">Tasbih Digital</h1>
                    <p className="text-xs sm:text-sm text-slate-500">Hitung dzikir dengan mudah dan khusyuk</p>
                </div>

                <div className="flex flex-col justify-center items-center gap-8 w-full min-h-[70vh]">
                    {!started ? (
                        <div className="flex flex-col items-center gap-10">
                            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-xl hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                onClick={() => setStarted(true)}>
                                <span className="text-8xl sm:text-[7rem] font-bold text-white ml-5">▶</span>
                            </div>
                            <p className="text-slate-600 text-sm sm:text-lg text-center">Mulai dzikir Anda dengan menekan tombol di atas</p>
                        </div>
                    ) : isComplete ? (
                        <div className="flex flex-col items-center gap-8 text-center">
                            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl">
                                <span className="text-7xl">✨</span>
                            </div>
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Selesai!</h2>
                                <p className="text-slate-600 text-lg">Semua dzikir telah diselesaikan</p>
                            </div>
                            <button
                                onClick={handleReset}
                                className="mt-0 sm:mt-3 px-8 py-3 bg-linear-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105">
                                Mulai Lagi
                            </button>
                        </div>
                    ) : (
                        <div className={`flex flex-col sm:flex-row items-center justify-around gap-8 sm:gap-20 mt-5 sm:mt-0 px-0 sm:px-10 w-full transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                            <div className="w-full sm:w-3/4">
                                <div className="w-full mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-semibold text-slate-700">Progress Keseluruhan</span>
                                        <span className="text-xs font-semibold text-slate-700">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className={`h-full bg-linear-to-r transition-all duration-300 ${currentDzikir.color}`} style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="text-center mt-10">
                                    <h2 className={`text-3xl sm:text-4xl font-bold ${currentDzikir.textColor} transition-all duration-300 select-none`}>{currentDzikir.name}</h2>
                                    <p className="text-slate-500 text-sm mt-2 select-none">Dzikir {dzikirIndex + 1} dari {DZIKIR_LIST.length}</p>
                                    <div className={`hidden sm:block text-center mt-6 ${currentDzikir.textColor}`}>
                                        <p className="text-6xl sm:text-8xl font-bold select-none">{counter}</p>
                                        <p className="text-lg sm:text-2xl mt-2 select-none">dari {MAX_COUNT}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex flex-col items-center justify-center gap-10">
                                <div onClick={handleCounter} className={`relative w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-linear-to-br ${currentDzikir.color} flex items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                                    style={{
                                        boxShadow: `0 0 40px rgba(${currentDzikir.color === 'from-green-400 to-teal-500' ? '16, 185, 129' : currentDzikir.color === 'from-blue-400 to-cyan-500' ? '34, 197, 94' : '99, 102, 241'}, 0.3)`
                                    }}>
                                    <p className="hidden sm:block text-2xl sm:text-4xl font-bold text-white select-none">Press</p>
                                    <div className="block sm:hidden text-center">
                                        <p className="text-6xl sm:text-8xl font-bold text-white select-none">{counter}</p>
                                        <p className="text-white text-lg sm:text-2xl mt-2 select-none">dari {MAX_COUNT}</p>
                                    </div>
                                </div>
                                <button onClick={handleReset} className="px-6 py-2 text-slate-600 font-semibold rounded-full border-2 border-slate-300 hover:bg-slate-100 transition-all duration-200 select-none">Reset</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}