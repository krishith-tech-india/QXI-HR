import * as React from "react";
import { cn } from "@/lib/utils";

const pad2 = (value) => String(value).padStart(2, "0");
const formatDisplay = (date) =>
    `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
const formatValue = (date) =>
    `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const parseValue = (value) => {
    if (!value) return null;
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }
    const raw = String(value).trim();
    if (!raw) return null;
    if (raw.includes("/")) {
        const [day, month, year] = raw.split("/").map(Number);
        if (!year || !month || !day) return null;
        return new Date(year, month - 1, day);
    }
    const [year, month, day] = raw.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
};

const monthLabel = (date) =>
    date.toLocaleString("en-US", { month: "long", year: "numeric" });

const monthNames = Array.from({ length: 12 }, (_, index) =>
    new Date(2024, index, 1).toLocaleString("en-US", { month: "short" })
);

const buildCalendarDays = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDayIndex = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < startDayIndex; i += 1) {
        days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        days.push(new Date(year, month, day));
    }
    return days;
};

const DatePicker = React.forwardRef(
    ({ className, value, name, onChange, min, max, ...props }, ref) => {
        const wrapperRef = React.useRef(null);
        const [isOpen, setIsOpen] = React.useState(false);
        const [isMonthOpen, setIsMonthOpen] = React.useState(false);
        const [isYearOpen, setIsYearOpen] = React.useState(false);
        const selectedDate = React.useMemo(() => parseValue(value), [value]);
        const [viewMonth, setViewMonth] = React.useState(
            selectedDate || new Date()
        );

        React.useEffect(() => {
            if (selectedDate) {
                setViewMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
            }
        }, [selectedDate]);

        React.useEffect(() => {
            const handleOutside = (event) => {
                if (!wrapperRef.current?.contains(event.target)) {
                    setIsOpen(false);
                    setIsMonthOpen(false);
                    setIsYearOpen(false);
                }
            };
            document.addEventListener("mousedown", handleOutside);
            return () => document.removeEventListener("mousedown", handleOutside);
        }, []);

        const handleSelect = (date) => {
            const formatted = formatValue(date);
            if (onChange) {
                onChange({ target: { name, value: formatted } });
            }
            setIsOpen(false);
        };

        const isDisabled = (date) => {
            const minDate = min ? parseValue(min) : null;
            const maxDate = max ? parseValue(max) : null;
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
        };

        const days = buildCalendarDays(viewMonth);
        const currentYear = new Date().getFullYear();
        const yearOptions = Array.from({ length: 101 }, (_, index) => currentYear - 80 + index);

        return (
            <div ref={wrapperRef} className="relative">
                <input
                    ref={ref}
                    readOnly
                    value={selectedDate ? formatDisplay(selectedDate) : ""}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={cn("custom-input cursor-pointer", className)}
                    name={name}
                    {...props}
                />
                {isOpen ? (
                    <div className="absolute z-20 mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100"
                                onClick={() =>
                                    setViewMonth(
                                        new Date(
                                            viewMonth.getFullYear(),
                                            viewMonth.getMonth() - 1,
                                            1
                                        )
                                    )
                                }
                            >
                                ‹
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMonthOpen((prev) => !prev);
                                            setIsYearOpen(false);
                                        }}
                                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {monthNames[viewMonth.getMonth()]}
                                        <span className="text-gray-500">▾</span>
                                    </button>
                                    {isMonthOpen ? (
                                        <div className="absolute left-0 mt-2 w-28 rounded-xl border border-gray-200 bg-white p-1 text-sm shadow-xl max-h-48 overflow-auto">
                                            {monthNames.map((label, index) => (
                                                <button
                                                    key={label}
                                                    type="button"
                                                    onClick={() => {
                                                        setViewMonth(
                                                            new Date(
                                                                viewMonth.getFullYear(),
                                                                index,
                                                                1
                                                            )
                                                        );
                                                        setIsMonthOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full rounded-lg px-2 py-1 text-left hover:bg-gray-100",
                                                        index === viewMonth.getMonth()
                                                            ? "bg-gray-900 text-white hover:bg-gray-900"
                                                            : "text-gray-700"
                                                    )}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsYearOpen((prev) => !prev);
                                            setIsMonthOpen(false);
                                        }}
                                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {viewMonth.getFullYear()}
                                        <span className="text-gray-500">▾</span>
                                    </button>
                                    {isYearOpen ? (
                                        <div className="absolute left-0 mt-2 w-28 rounded-xl border border-gray-200 bg-white p-1 text-sm shadow-xl max-h-56 overflow-auto">
                                            {yearOptions.map((year) => (
                                                <button
                                                    key={year}
                                                    type="button"
                                                    onClick={() => {
                                                        setViewMonth(
                                                            new Date(
                                                                year,
                                                                viewMonth.getMonth(),
                                                                1
                                                            )
                                                        );
                                                        setIsYearOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full rounded-lg px-2 py-1 text-left hover:bg-gray-100",
                                                        year === viewMonth.getFullYear()
                                                            ? "bg-gray-900 text-white hover:bg-gray-900"
                                                            : "text-gray-700"
                                                    )}
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100"
                                onClick={() =>
                                    setViewMonth(
                                        new Date(
                                            viewMonth.getFullYear(),
                                            viewMonth.getMonth() + 1,
                                            1
                                        )
                                    )
                                }
                            >
                                ›
                            </button>
                        </div>
                        <div className="mt-3 grid grid-cols-7 text-xs text-gray-500">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                                (label) => (
                                    <div key={label} className="py-1 text-center">
                                        {label}
                                    </div>
                                )
                            )}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-sm">
                            {days.map((day, index) => {
                                if (!day) {
                                    return <div key={`empty-${index}`} />;
                                }
                                const isSelected =
                                    selectedDate &&
                                    day.toDateString() === selectedDate.toDateString();
                                const disabled = isDisabled(day);
                                return (
                                    <button
                                        key={day.toISOString()}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => handleSelect(day)}
                                        className={cn(
                                            "h-9 w-9 rounded-full text-center transition",
                                            disabled
                                                ? "cursor-not-allowed text-gray-300"
                                                : "hover:bg-gray-100",
                                            isSelected
                                                ? "bg-gray-900 text-white hover:bg-gray-900"
                                                : "text-gray-700"
                                        )}
                                    >
                                        {day.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
