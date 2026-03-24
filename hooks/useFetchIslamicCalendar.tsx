import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ApiCalendarItem {
    timings: {
        Fajr: string;
        Sunrise: string;
        Dhuhr: string;
        Asr: string;
        Sunset: string;
        Maghrib: string;
        Isha: string;
        Imsak: string;
        Midnight: string;
    };
    date: {
        readable: string;
        timestamp: string;
        gregorian: {
            date: string;
            day: string;
            month: {
                number: number;
                en: string;
            };
            year: string;
        };
        hijri: {
            date: string;
            day: string;
            weekday: {
                en: string;
                ar: string;
            };
            month: {
                number: number;
                en: string;
                ar: string;
            };
            year: string;
            holidays: string[];
        };
    };
    meta: object;
}

interface HijriCalendarResponse {
    code: number;
    status: string;
    data: ApiCalendarItem[];
}

export interface HijriDay {
    date: string;
    day: number;
    prayers: {
        Fajr: string;
        Sunrise: string;
        Dhuhr: string;
        Asr: string;
        Sunset: string;
        Maghrib: string;
        Isha: string;
        Imsak: string;
        Midnight: string;
    };
    gregorian: {
        day: string;
        month: {
            number: number;
            en: string;
            ar?: string;
        };
        year: string;
    };
    hijri: {
        date: string;
        day: number;
        weekday: {
            en: string;
            ar: string;
        };
        month: {
            number: number;
            en: string;
            ar: string;
        };
        year: string;
        holidays: string[];
    };
}

interface ConvertedDate {
    hijri: {
        date: string;
        month: {
            number: number;
            en: string;
            ar?: string;
        };
        year: string;
    };
}

export const useFetchIslamicCalendar = (
    month: number,
    year: number,
    city: string,
    country: string = "Indonesia",
    method: number = 11
) => {
    return useQuery({
        queryKey: ["islamic-calendar", month, year, city],
        queryFn: async () => {
            const response = await axios.get<HijriCalendarResponse>(
                `https://api.aladhan.com/v1/calendarByCity/${year}/${month}`,
                {
                    params: {
                        city,
                        country,
                        method,
                    },
                }
            );

            const transformed: HijriDay[] = response.data.data.map((item) => ({
                date: item.date.gregorian.date,
                day: parseInt(item.date.gregorian.day, 10),
                prayers: item.timings,
                gregorian: {
                    day: item.date.gregorian.day,
                    month: item.date.gregorian.month,
                    year: item.date.gregorian.year
                },
                hijri: {
                    date: item.date.hijri.date,
                    day: parseInt(item.date.hijri.day, 10),
                    weekday: item.date.hijri.weekday,
                    month: item.date.hijri.month,
                    year: item.date.hijri.year,
                    holidays: item.date.hijri.holidays ?? [],
                },
            }));

            return transformed;
        },
        enabled: !!city && !!year && !!month,
    });
};

export const useFetchHijriMonthInfo = (month: number, year: number) => {
    return useQuery({
        queryKey: ["hijri-month-info", month, year],
        queryFn: async () => {
            const day = "01";
            const mm = String(month).padStart(2, "0");
            const date = `${day}-${mm}-${year}`;

            const response = await axios.get(
                `https://api.aladhan.com/v1/gToHijri`,
                {
                    params: { date },
                }
            );
            return response.data.data as ConvertedDate;
        },
        enabled: !!year && !!month,
    });
};