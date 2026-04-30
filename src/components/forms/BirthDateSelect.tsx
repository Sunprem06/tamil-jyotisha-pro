import { cn } from "@/lib/utils";

interface BirthDateSelectProps {
  value: string;
  onChange: (value: string) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
}

const pad = (value: number) => String(value).padStart(2, "0");

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const parseDateValue = (value: string, minYear: number) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return { year: minYear, month: 1, day: 1 };

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
};

export const formatDateForInput = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseInputDate = (value: string) => {
  const { year, month, day } = parseDateValue(value, 1900);
  return new Date(year, month - 1, day);
};

export function BirthDateSelect({
  value,
  onChange,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
  className,
}: BirthDateSelectProps) {
  const selected = parseDateValue(value, minYear);
  const safeYear = Math.min(Math.max(selected.year, minYear), maxYear);
  const safeMonth = Math.min(Math.max(selected.month, 1), 12);
  const maxDay = getDaysInMonth(safeYear, safeMonth);
  const safeDay = Math.min(Math.max(selected.day, 1), maxDay);
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => maxYear - index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const days = Array.from({ length: maxDay }, (_, index) => index + 1);

  const updateDate = (part: "year" | "month" | "day", rawValue: string) => {
    const nextYear = part === "year" ? Number(rawValue) : safeYear;
    const nextMonth = part === "month" ? Number(rawValue) : safeMonth;
    const nextMaxDay = getDaysInMonth(nextYear, nextMonth);
    const nextDay = part === "day" ? Number(rawValue) : Math.min(safeDay, nextMaxDay);

    onChange(`${nextYear}-${pad(nextMonth)}-${pad(nextDay)}`);
  };

  const selectClassName =
    "h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  return (
    <div className={cn("grid grid-cols-[1fr_1fr_1.3fr] gap-2", className)}>
      <select
        aria-label="Day"
        value={safeDay}
        onChange={(event) => updateDate("day", event.target.value)}
        className={selectClassName}
      >
        {days.map((day) => (
          <option key={day} value={day}>
            {pad(day)}
          </option>
        ))}
      </select>
      <select
        aria-label="Month"
        value={safeMonth}
        onChange={(event) => updateDate("month", event.target.value)}
        className={selectClassName}
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {pad(month)}
          </option>
        ))}
      </select>
      <select
        aria-label="Year"
        value={safeYear}
        onChange={(event) => updateDate("year", event.target.value)}
        className={selectClassName}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
