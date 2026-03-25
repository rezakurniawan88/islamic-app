"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = "alquran" | "prayer"

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        {
            id: "alquran" as NavItem,
            label: "Al-Qur'an",
            href: "/"
        },
        {
            id: "prayer" as NavItem,
            label: "Prayer Time",
            href: "/prayer"
        }
    ]

    return (
        <header className={`sticky top-0 z-20 flex items-center justify-between w-full py-5 px-12 border-b border-slate-100 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"}`}>
            {/* <div className="flex items-center gap-8"> */}
            <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400 lucide lucide-moon-star-icon lucide-moon-star"><path d="M18 5h4" /><path d="M20 3v4" /><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>
                <h1 className="text-teal-400 text-lg font-semibold">Islamic App</h1>
            </div>
            {/* </div> */}
            <nav className="flex gap-6">
                {navItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                        <h1 className={`text-sm font-semibold cursor-pointer ${pathname === item.href ? "text-teal-400 hover:text-teal-500" : "text-slate-500 hover:text-slate-700"}`}>{item.label}</h1>
                    </Link>
                ))}
            </nav>
            <div className="flex items-center gap-3">
                <button className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>
                </button>
                <button className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 lucide lucide-github-icon lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                </button>
            </div>
        </header>
    )
}
