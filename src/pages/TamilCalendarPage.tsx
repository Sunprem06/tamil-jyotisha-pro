import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sun, Moon, AlertTriangle, CheckCircle, Clock, Home, BedDouble } from "lucide-react";
import {
  TAMIL_MONTHS, TAMIL_WEEKDAYS, TAMIL_YEAR_CYCLE,
  getTamilYear, getTamilMonth, getTamilWeekday,
  getApproxNakshatra, getApproxTithi, getApproxYogam, getPaksha,
} from "@/data/tamilCalendar";
import {
  getRahuKalam, getYamagandam, getKuligai,
  getNallaNeram, getGowriNallaNeram, getGrahaOrai,
  getSubhaMuhurtham, getPalliVilumPalan, getManaiyadiSasthiram,
  getSunriseTime, getSunsetTime,
} from "@/lib/astrology/panchangam";
import { getHolidaysForDate, getHolidaysForYear, getHolidayTypeColor, getHolidayTypeLabel } from "@/data/tamilHolidays";

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function InfoCard({ icon, label, sublabel, value, variant }: { icon: React.ReactNode; label: string; sublabel?: string; value: string | React.ReactNode; variant?: 'good' | 'bad' | 'neutral' }) {
  const borderColor = variant === 'good' ? 'border-l-green-500' : variant === 'bad' ? 'border-l-destructive' : 'border-l-primary';
  return (
    <div className={`rasi-card flex items-center gap-3 border-l-4 ${borderColor}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-tamil">{label}{sublabel ? ` / ${sublabel}` : ''}</p>
        <div className="font-tamil font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function DailyView({ date, setDate }: { date: Date; setDate: (d: Date) => void }) {
  const tamilYear = getTamilYear(date);
  const tamilMonth = getTamilMonth(date);
  const tamilDay = getTamilWeekday(date);
  const nakshatra = getApproxNakshatra(date);
  const tithi = getApproxTithi(date);
  const yogam = getApproxYogam(date);
  const paksha = getPaksha(date);

  const rahuKalam = getRahuKalam(date);
  const yamagandam = getYamagandam(date);
  const kuligai = getKuligai(date);
  const nallaNeram = getNallaNeram(date);
  const gowriNallaNeram = getGowriNallaNeram(date);
  const grahaOrai = getGrahaOrai(date);
  const subhaMuhurtham = getSubhaMuhurtham(date);
  const palliVilum = getPalliVilumPalan(date);
  const manaiyadi = getManaiyadiSasthiram(date);
  const holidays = getHolidaysForDate(date);

  const prev = () => setDate(new Date(date.getTime() - 86400000));
  const next = () => setDate(new Date(date.getTime() + 86400000));
  const goToday = () => setDate(new Date());

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
        <div className="text-center">
          <p className="text-lg font-bold font-tamil">{tamilDay.tamil}</p>
          <p className="text-sm text-muted-foreground">{date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button variant="outline" size="icon" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
      </div>
      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={goToday} className="font-tamil">இன்று / Today</Button>
      </div>

      {/* Tamil Date Card */}
      <div className="rasi-card text-center space-y-2">
        <div className="text-5xl font-bold text-primary">{date.getDate()}</div>
        <div className="text-xl font-tamil font-bold">{tamilMonth.tamil} — {tamilMonth.english}</div>
        <div className="text-sm text-muted-foreground">{ENGLISH_MONTHS[date.getMonth()]} {date.getFullYear()}</div>
        <div className="text-sm font-tamil text-primary">{tamilYear.tamil} வருடம் ({tamilYear.english})</div>
      </div>

      {/* Holidays */}
      {holidays.length > 0 && (
        <div className="rasi-card space-y-2">
          <h3 className="font-bold font-tamil text-lg">🎉 விடுமுறை / பண்டிகை</h3>
          {holidays.map((h, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="font-tamil font-semibold">{h.name_tamil}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-tamil ${getHolidayTypeColor(h.type)}`}>
                {getHolidayTypeLabel(h.type)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Panchangam Details */}
      <div>
        <h3 className="font-bold font-tamil text-lg mb-3">📿 பஞ்சாங்கம்</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoCard icon={<Sun className="h-5 w-5 text-orange-500" />} label="நட்சத்திரம்" sublabel="Nakshatra" value={nakshatra} />
          <InfoCard icon={<Moon className="h-5 w-5 text-blue-400" />} label="திதி" sublabel="Tithi" value={tithi} />
          <InfoCard icon={<span className="text-lg">☯</span>} label="யோகம்" sublabel="Yogam" value={yogam} />
          <InfoCard icon={<span className="text-lg">{paksha.english.includes('Waxing') ? '🌓' : '🌗'}</span>} label="பட்சம்" sublabel="Paksha" value={paksha.tamil} />
          <InfoCard icon={<span className="text-lg">🌅</span>} label="சூரிய உதயம்" sublabel="Sunrise" value={getSunriseTime(date)} />
          <InfoCard icon={<span className="text-lg">🌇</span>} label="சூரிய அஸ்தமனம்" sublabel="Sunset" value={getSunsetTime(date)} />
        </div>
      </div>

      {/* Nalla Neram & Gowri Nalla Neram */}
      <div>
        <h3 className="font-bold font-tamil text-lg mb-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" /> நல்ல நேரம் & கௌரி நல்ல நேரம்
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rasi-card border-l-4 border-l-green-500">
            <p className="text-sm font-bold font-tamil mb-2">✅ நல்ல நேரம்</p>
            <div className="space-y-1">
              {nallaNeram.map((slot, i) => (
                <span key={i} className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm px-2 py-1 rounded mr-2 mb-1">
                  {slot.start} - {slot.end}
                </span>
              ))}
            </div>
          </div>
          <div className="rasi-card border-l-4 border-l-amber-500">
            <p className="text-sm font-bold font-tamil mb-2">🌟 கௌரி நல்ல நேரம்</p>
            <div className="space-y-1">
              {gowriNallaNeram.map((slot, i) => (
                <span key={i} className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm px-2 py-1 rounded mr-2 mb-1">
                  {slot.start} - {slot.end}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inauspicious Times */}
      <div>
        <h3 className="font-bold font-tamil text-lg mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" /> தவிர்க்க வேண்டிய நேரங்கள்
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InfoCard icon={<span className="text-lg">🐍</span>} label="ராகு காலம்" value={`${rahuKalam.start} - ${rahuKalam.end}`} variant="bad" />
          <InfoCard icon={<span className="text-lg">💀</span>} label="எமகண்டம்" value={`${yamagandam.start} - ${yamagandam.end}`} variant="bad" />
          <InfoCard icon={<span className="text-lg">⚠️</span>} label="குளிகை" value={`${kuligai.start} - ${kuligai.end}`} variant="bad" />
        </div>
      </div>

      {/* Subha Muhurtham */}
      <div className="rasi-card">
        <h3 className="font-bold font-tamil text-lg mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" /> முக்கிய சுப முகூர்த்தம்
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {subhaMuhurtham.map((slot, i) => (
            <div key={i} className="bg-primary/5 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground font-tamil">{i === 0 ? 'பிரம்ம முகூர்த்தம்' : i === 1 ? 'அபிஜித் முகூர்த்தம்' : 'கௌரி முகூர்த்தம்'}</p>
              <p className="font-bold font-tamil">{slot.start} - {slot.end}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Graha Orai */}
      <div className="rasi-card">
        <h3 className="font-bold font-tamil text-lg mb-3">🪐 கிரக ஓரைகள்</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {grahaOrai.slice(0, 8).map((orai, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-2 text-center text-sm">
              <p className="font-tamil font-semibold">{orai.planet_tamil}</p>
              <p className="text-xs text-muted-foreground">{orai.start} - {orai.end}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Palli Vilum Palan */}
      <div className="rasi-card">
        <h3 className="font-bold font-tamil text-lg mb-3 flex items-center gap-2">
          <BedDouble className="h-5 w-5 text-primary" /> பல்லி விழும் பலன்
        </h3>
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 rounded-full p-3">
            <span className="text-2xl">🦎</span>
          </div>
          <div>
            <p className="font-tamil font-semibold">{palliVilum.direction_tamil} ({palliVilum.direction_english})</p>
            <p className="font-tamil text-sm text-muted-foreground">{palliVilum.palan_tamil}</p>
          </div>
        </div>
      </div>

      {/* Manaiyadi Sasthiram */}
      <div className="rasi-card">
        <h3 className="font-bold font-tamil text-lg mb-3 flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" /> மனையடி சாஸ்திரம்
        </h3>
        <div className="flex items-start gap-3">
          <div className={`rounded-full p-3 ${manaiyadi.favorable ? 'bg-green-100 dark:bg-green-900/30' : 'bg-destructive/10'}`}>
            <span className="text-2xl">🏠</span>
          </div>
          <div>
            <p className="font-tamil font-semibold">{manaiyadi.direction_tamil}</p>
            <p className="font-tamil text-sm text-muted-foreground">{manaiyadi.palan_tamil}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${manaiyadi.favorable ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-destructive/10 text-destructive'}`}>
              {manaiyadi.favorable ? '✅ சாதகமான நாள்' : '⚠️ எச்சரிக்கை'}
            </span>
          </div>
        </div>
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
  const holidays = getHolidaysForYear(year);

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));
  const tamilMonth = getTamilMonth(new Date(year, month, 15));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isHoliday = (day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return holidays.some(h => h.date === `${mm}-${dd}`);
  };

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

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {TAMIL_WEEKDAYS.map(d => (
          <div key={d.english} className="py-1">
            <span className="font-tamil block">{d.short}</span>
            <span className="text-muted-foreground">{d.english.substring(0, 3)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const cellDate = new Date(year, month, day);
          const isToday = cellDate.toDateString() === today.toDateString();
          const isSelected = cellDate.toDateString() === date.toDateString();
          const hasHoliday = isHoliday(day);

          return (
            <button
              key={day}
              onClick={() => setDate(cellDate)}
              className={`p-1.5 rounded-lg text-center transition-colors hover:bg-accent relative ${
                isToday ? 'ring-2 ring-primary' : ''
              } ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <span className="block text-sm font-bold">{day}</span>
              <span className="block text-[9px] font-tamil truncate text-muted-foreground">
                {getApproxNakshatra(cellDate).substring(0, 4)}
              </span>
              {hasHoliday && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-destructive"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Month's holidays */}
      <div className="rasi-card">
        <h3 className="font-bold font-tamil mb-3">🎉 இம்மாத விடுமுறைகள்</h3>
        {holidays.filter(h => {
          const [mm] = h.date.split('-');
          return parseInt(mm) === month + 1;
        }).length === 0 ? (
          <p className="text-sm text-muted-foreground font-tamil">இம்மாதம் விடுமுறை இல்லை</p>
        ) : (
          <div className="space-y-2">
            {holidays.filter(h => {
              const [mm] = h.date.split('-');
              return parseInt(mm) === month + 1;
            }).map((h, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="font-tamil">{h.date.split('-')[1]} — {h.name_tamil}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getHolidayTypeColor(h.type)}`}>{getHolidayTypeLabel(h.type)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function YearlyView({ date, setDate }: { date: Date; setDate: (d: Date) => void }) {
  const year = date.getFullYear();
  const tamilYear = getTamilYear(new Date(year, 6, 1));
  const holidays = getHolidaysForYear(year);

  const prevYear = () => setDate(new Date(year - 1, date.getMonth(), 1));
  const nextYear = () => setDate(new Date(year + 1, date.getMonth(), 1));

  // Important Vratham days
  const vrathams = holidays.filter(h => h.type === 'vratham');
  const festivals = holidays.filter(h => h.type === 'festival');
  const national = holidays.filter(h => h.type === 'national' || h.type === 'government');
  const state = holidays.filter(h => h.type === 'state');

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

      {/* Tamil Months */}
      <div>
        <h3 className="font-tamil font-bold mb-3">தமிழ் மாதங்கள்</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {TAMIL_MONTHS.map(m => (
            <div key={m.no} className="rasi-card text-center cursor-pointer hover:border-primary transition" onClick={() => {
              const approxMonth = m.no <= 9 ? m.no + 2 : m.no - 10;
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
            <Button key={m} variant={i === date.getMonth() ? "default" : "outline"} size="sm" className="text-xs"
              onClick={() => setDate(new Date(year, i, 1))}>{m.substring(0, 3)}</Button>
          ))}
        </div>
      </div>

      {/* All holidays categorized */}
      <div className="space-y-4">
        {[
          { title: '🇮🇳 தேசிய / அரசு விடுமுறைகள்', items: national },
          { title: '🏛️ மாநில விடுமுறைகள்', items: state },
          { title: '🎉 பண்டிகை விடுமுறைகள்', items: festivals },
          { title: '🙏 முக்கிய விரத நாட்கள்', items: vrathams },
        ].map(section => (
          <div key={section.title} className="rasi-card">
            <h3 className="font-bold font-tamil mb-3">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((h, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-tamil">{h.name_tamil}</span>
                  <span className="text-muted-foreground">{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
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
          <div key={y.no} className={`p-2 rounded-lg border text-center text-sm transition ${
            y.no === currentYear.no ? 'bg-primary text-primary-foreground border-primary shadow-lg' : 'bg-card hover:border-primary/50'
          }`}>
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
          <h1 className="text-3xl font-bold font-tamil text-gradient-sacred">தமிழ் நாள்காட்டி</h1>
          <p className="text-muted-foreground">Tamil & English Calendar with Full Panchangam</p>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily" className="font-tamil text-xs sm:text-sm">தினசரி</TabsTrigger>
            <TabsTrigger value="monthly" className="font-tamil text-xs sm:text-sm">மாதம்</TabsTrigger>
            <TabsTrigger value="yearly" className="font-tamil text-xs sm:text-sm">வருடம்</TabsTrigger>
            <TabsTrigger value="cycle" className="font-tamil text-xs sm:text-sm">60 சுழற்சி</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6"><DailyView date={date} setDate={setDate} /></TabsContent>
          <TabsContent value="monthly" className="mt-6"><MonthlyView date={date} setDate={setDate} /></TabsContent>
          <TabsContent value="yearly" className="mt-6"><YearlyView date={date} setDate={setDate} /></TabsContent>
          <TabsContent value="cycle" className="mt-6"><CycleView /></TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
