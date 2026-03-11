"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react"

type NavItem = "alquran" | "prayer"

export default function Sidebar() {
    const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const pathname = usePathname();

    const navItems = [
        {
            id: "alquran" as NavItem,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-500 lucide lucide-book-open"><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></svg>
            ),
            label: "Al-Qur'an",
            href: "/"
        },
        {
            id: "prayer" as NavItem,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-500 lucide lucide-clock-3"><circle cx="12" cy="12" r="10" /><path d="M12 6v6h4" /></svg>
            ),
            label: "Jadwal Shalat",
            href: "/prayer"
        },
        {
            id: "imsakiyah" as NavItem,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-500 lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>
            ),
            label: "Imsakiyah",
            href: "/imsakiyah"
        },
        {
            id: "asmaul-husna" as NavItem,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-500"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="m8 13 4-7 4 7" /><path d="M9.1 11h5.7" /></svg>
            ),
            label: "Asmaul Husna",
            href: "/asmaul-husna"
        }
    ]

    const isPathActive = (href: string) => {
        if (href === "/") {
            return pathname === "/" || pathname.startsWith("/ayah");
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            <div className={`hidden sm:flex ${sidebarIsOpen ? "w-52 sm:w-64" : "w-16 sm:w-20"} sticky top-0 left-0 h-screen bg-gray-50 border-r border-gray-200 px-4 py-6 transition-all duration-300 ease-in-out flex-col`}>
                <div className={`flex items-center ${sidebarIsOpen ? "justify-between px-3" : "justify-center w-full"}`}>
                    {sidebarIsOpen && (
                        <div className={`flex items-center gap-2`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 w-4 sm:w-5 h-4 sm:h-5 lucide lucide-moon-star-icon lucide-moon-star"><path d="M18 5h4" /><path d="M20 3v4" /><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>
                            <h1 className="text-sm sm:text-base text-emerald-400 font-semibold whitespace-nowrap">Islamic App</h1>
                        </div>
                    )}
                    <button onClick={() => setSidebarIsOpen(!sidebarIsOpen)} className={`p-2 hover:bg-gray-100 rounded-full cursor-pointer ${sidebarIsOpen ? "-mr-2" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-600 lucide lucide-menu-icon lucide-menu"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></svg>
                    </button>
                </div>
                <div className={`${sidebarIsOpen ? "p-3 mt-5" : "p-0 mt-5"}`}>
                    {sidebarIsOpen && <h1 className="text-sm text-gray-400 mb-2">Menu</h1>}
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`group flex items-center ${sidebarIsOpen ? "gap-2" : "justify-center"} py-1 rounded-lg cursor-pointer transition-all duration-300 ${isPathActive(item.href)
                                    ? "bg-slate-100"
                                    : "hover:bg-slate-100 text-slate-700"
                                    }`}
                            >
                                <div className="p-2 rounded-lg transition-all duration-300">
                                    {item.icon}
                                </div>
                                {sidebarIsOpen && (
                                    <h3 className={`font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${isPathActive(item.href)
                                        ? "text-emerald-500"
                                        : "text-slate-500 group-hover:text-slate-700"
                                        }`}>
                                        {item.label}
                                    </h3>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-auto">
                    &copy; {new Date().getFullYear()} Islamic App.
                </p>
            </div>

            <div className="sm:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-40 flex items-center gap-2">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-600"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></svg>
                </button>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 w-4 h-4 lucide lucide-moon-star-icon lucide-moon-star"><path d="M18 5h4" /><path d="M20 3v4" /><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>
                    <h1 className="text-base text-emerald-400 font-semibold">Islamic App</h1>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="sm:hidden fixed inset-0 bg-black/50 bg-opacity-50 z-30" onClick={() => setMobileMenuOpen(false)} />
            )}
            <div className={`sm:hidden fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-50 p-4 transition-transform duration-300 ease-in-out z-40 flex flex-col ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex items-center justify-between pl-1 pr-0 mb-4 pt-1">
                    <div className="flex items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 w-5 h-5 lucide lucide-moon-star-icon lucide-moon-star"><path d="M18 5h4" /><path d="M20 3v4" /><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>
                        <h1 className="text-emerald-400 font-semibold">Islamic App</h1>
                    </div>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[1.15rem] h-[1.15rem] text-gray-600"><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-1">
                    <h1 className="text-sm text-gray-400 mb-2">Main</h1>
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`group flex items-center gap-1 px-1 py-1.5 rounded-lg cursor-pointer transition-all duration-300 ${isPathActive(item.href)
                                    ? "bg-slate-100"
                                    : "hover:bg-slate-100 text-slate-700"
                                    }`}
                            >
                                <div className="p-2 rounded-lg transition-all duration-300">
                                    {item.icon}
                                </div>
                                <h3 className={`font-semibold text-sm transition-colors duration-300 ${isPathActive(item.href)
                                    ? "text-emerald-500"
                                    : "text-slate-500 group-hover:text-slate-700"
                                    }`}>
                                    {item.label}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-auto">
                    &copy; {new Date().getFullYear()} Islamic App.
                </p>
            </div>
        </>
    )
}