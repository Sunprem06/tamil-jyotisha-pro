import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sun, Moon } from "lucide-react";
import {
  TAMIL_MONTHS, TAMIL_WEEKDAYS, TAMIL_YEAR_CYCLE,
  getTamilYear, getTamilMonth, getTamilWeekday,
  getApproxNakshatra, getApproxTithi, getApproxYogam, getPaksha,
} from "@/data/tamilCalendar";

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function DailyView({ date, setDate }: { date: Date; setDate: (d: Date) => void }) {
  const tamilYear = getTamilYear(date);
  const tamilMonth = getTamilMonth(date);
  const tamilDay = getTamilWeekday(date);
  const nakshatra = getApproxNakshatra(date);
  const tithi = getApproxTithi(date);
  const yogam = getApproxYogam(date);
  const paksha = getPaksha(date);

  const prev = () => setDate(new Date(date.getTime() - 86400000));
  const next = () => setDate(new Date(date.getTime() + 86400000));
  const today = () => setDate(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
        <div className="text-center">
          <p className="text-lg font-bold font-tamil">{tamilDay.tamil}</p>
          <p className="text-sm text-muted-foreground">{date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button variant="outline" size="icon" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
      </div>

      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={today} className="font-tamil">இன்று / Today</Button>
      </div>

      {/* Tamil Date Card */}
      <div className="rasi-card text-center space-y-2">
        <div className="text-5xl font-bold text-primary">{date.getDate()}</div>
        <div className="text-xl font-tamil font-bold">{tamilMonth.tamil} — {tamilMonth.english}</div>
        <div className="text-sm text-muted-foreground">{ENGLISH_MONTHS[date.getMonth()]} {date.getFullYear()}</div>
        <div className="text-sm font-tamil text-primary">{tamilYear.tamil} வருடம் ({tamilYear.english})</div>
      </div>

      {/* Panchangam Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={<Sun className="h-5 w-5 text-orange-500" />} label="நட்சத்திரம்" sublabel="Nakshatra" value={nakshatra} />
        <InfoCard icon={<Moon className="h-5 w-5 text-blue-400" />} label="திதி" sublabel="Tithi" value={tithi} />
        <InfoCard icon={<span className="text-lg">☯</span>} label="யோகம்" sublabel="Yogam" value={yogam} />
        <InfoCard icon={<span className="text-lg">{paksha.english.includes('Waxing') ? '🌓' : '🌗'}</span>} label="பட்சம்" sublabel="Paksha" value={paksha.tamil} />
        <InfoCard icon={<span className="text-lg">🪐</span>} label="கிரகம்" sublabel="Ruling Planet" value={tamilDay.planet} />
        <InfoCard icon={<CalendarIcon className="h-5 w-5 text-green-600" />} label="தமிழ் மாதம்" sublabel="Tamil Month" value={`${tamilMonth.tamil} (${tamilMonth.sunSign})`} />
      </div>
    </div>
  );
}

function InfoCard({ icon, label, sublabel, value }: { icon: React.ReactNode; label: string; sublabel: string; value: string }) {
  return (
    <div className="rasi-card flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label} / {sublabel}</p>
        <p className="font-tamil font-semibold">{value}</p>
      </div>
    </div>
  );
}

function MonthlyView({ date, setDate }: { date: Date; setDate: (d: Date) => void }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));

  const tamilMonth = getTamilMonth(new Date(year, month, 15));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
        <div className="text-center">
          <p className="text-lg font-bold">{ENGLISH_MONTHS[month]} {year}</p>
          <p className="text-sm font-tamil text-primary">{tamilMonth.tamil} — {getTamilYear(new Date(year, month, 15)).tamil}</p>
        </div>
        <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {TAMIL_WEEKDAYS.map(d => (
          <div key={d.english} className="py-1">
            <span className="font-tamil block">{d.short}</span>
            <span className="text-muted-foreground">{d.english.substring(0, 3)}</span>
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const cellDate = new Date(year, month, day);
          const isToday = cellDate.toDateString() === today.toDateString();
          const isSelected = cellDate.toDateString() === date.toDateString();
          const nakshatra = getApproxNakshatra(cellDate);

          return (
            <button
              key={day}
              onClick={() => setDate(cellDate)}
              className={`p-1.5 rounded-lg text-center transition-colors hover:bg-accent ${
                isToday ? 'ring-2 ring-primary' : ''
              } ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <span className="block text-sm font-bold">{day}</span>
              <span className="block text-[9px] font-tamil truncate text-muted-foreground">
                {nakshatra.substring(0, 4)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YearlyView({ date, setDate }: { date: Date; setDate: (d: Date) => void }) {
  const year = date.getFullYear();
  const tamilYear = getTamilYear(new Date(year, 6, 1));

  const prevYear = () => setDate(new Date(year - 1, date.getMonth(), 1));
  const nextYear = () => setDate(new Date(year + 1, date.getMonth(), 1));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prevYear}><ChevronLeft className="h-4 w-4" /></Button>
        <div className="text-center">
          <p className="text-xl font-bold">{year}</p>
          <p className="text-sm font-tamil text-primary">{tamilYear.tamil} ({tamilYear.english})</p>
        </div>
        <Button variant="outline" size="icon" onClick={nextYear}><ChevronRight className="h-4 w-4" /></Button>
      </div>

      {/* Tamil Months Grid */}
      <div>
        <h3 className="font-tamil font-bold mb-3">தமிழ் மாதங்கள் / Tamil Months</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {TAMIL_MONTHS.map(m => (
            <div key={m.no} className="rasi-card text-center cursor-pointer hover:border-primary transition" onClick={() => {
              // Navigate to approximate start date of this Tamil month
              const approxMonth = m.no <= 9 ? m.no + 2 : m.no - 10; // map to JS month
              setDate(new Date(year, approxMonth, 15));
            }}>
              <p className="font-tamil font-bold text-sm">{m.tamil}</p>
              <p className="text-xs text-muted-foreground">{m.english}</p>
              <p className="text-[10px] text-muted-foreground mt-1">~{m.startApprox}</p>
            </div>
          ))}
        </div>
      </div>

      {/* English Months */}
      <div>
        <h3 className="font-bold mb-3">English Months</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {ENGLISH_MONTHS.map((m, i) => (
            <Button
              key={m}
              variant={i === date.getMonth() ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setDate(new Date(year, i, 1))}
            >
              {m.substring(0, 3)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CycleView() {
  const currentYear = getTamilYear(new Date());

  return (
    <div className="space-y-4">
      <div className="rasi-card text-center">
        <p className="font-tamil text-sm text-muted-foreground">நடப்பு ஆண்டு / Current Year</p>
        <p className="text-2xl font-bold font-tamil text-primary">{currentYear.tamil}</p>
        <p className="text-muted-foreground">{currentYear.english} (#{currentYear.no}/60)</p>
      </div>

      <h3 className="font-tamil font-bold">60 வருட சுழற்சி / 60-Year Cycle</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {TAMIL_YEAR_CYCLE.map(y => (
          <div
            key={y.no}
            className={`p-2 rounded-lg border text-center text-sm transition ${
              y.no === currentYear.no
                ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                : 'bg-card hover:border-primary/50'
            }`}
          >
            <span className="text-xs text-muted-foreground">#{y.no}</span>
            <p className="font-tamil font-semibold">{y.tamil}</p>
            <p className="text-[10px] text-muted-foreground">{y.english}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TamilCalendarPage() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 max-w-4xl">
        <BackButton />
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-tamil text-gradient-sacred">
            தமிழ் நாள்காட்டி
          </h1>
          <p className="text-muted-foreground">Tamil & English Calendar</p>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily" className="font-tamil text-xs sm:text-sm">தினசரி / Daily</TabsTrigger>
            <TabsTrigger value="monthly" className="font-tamil text-xs sm:text-sm">மாதம் / Month</TabsTrigger>
            <TabsTrigger value="yearly" className="font-tamil text-xs sm:text-sm">வருடம் / Year</TabsTrigger>
            <TabsTrigger value="cycle" className="font-tamil text-xs sm:text-sm">60 சுழற்சி</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <DailyView date={date} setDate={setDate} />
          </TabsContent>
          <TabsContent value="monthly" className="mt-6">
            <MonthlyView date={date} setDate={setDate} />
          </TabsContent>
          <TabsContent value="yearly" className="mt-6">
            <YearlyView date={date} setDate={setDate} />
          </TabsContent>
          <TabsContent value="cycle" className="mt-6">
            <CycleView />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
