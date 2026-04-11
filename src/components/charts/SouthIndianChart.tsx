import { RASI_NAMES } from "@/lib/astrology/constants";
import type { PlanetPosition } from "@/lib/astrology/types";

interface RasiChartProps {
  lagna: number;
  planets: PlanetPosition[];
  title?: string;
}

// South Indian chart: fixed rasi positions in a 4x4 grid
// Layout (0-indexed rasi numbers):
// [11] [0]  [1]  [2]
// [10] [  center  ] [3]
// [9]  [  center  ] [4]
// [8]  [7]  [6]  [5]
const CHART_POSITIONS: { rasi: number; col: number; row: number }[] = [
  { rasi: 11, col: 0, row: 0 }, { rasi: 0, col: 1, row: 0 }, { rasi: 1, col: 2, row: 0 }, { rasi: 2, col: 3, row: 0 },
  { rasi: 10, col: 0, row: 1 }, { rasi: 3, col: 3, row: 1 },
  { rasi: 9, col: 0, row: 2 }, { rasi: 4, col: 3, row: 2 },
  { rasi: 8, col: 0, row: 3 }, { rasi: 7, col: 1, row: 3 }, { rasi: 6, col: 2, row: 3 }, { rasi: 5, col: 3, row: 3 },
];

export function SouthIndianChart({ lagna, planets, title = "ராசி சக்கரம்" }: RasiChartProps) {
  // Group planets by rasi
  const planetsByRasi: Record<number, PlanetPosition[]> = {};
  planets.forEach(p => {
    if (!planetsByRasi[p.rasi]) planetsByRasi[p.rasi] = [];
    planetsByRasi[p.rasi].push(p);
  });

  const cellSize = 80;
  const gap = 2;
  const totalSize = cellSize * 4 + gap * 5;

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-bold font-tamil mb-3 text-lg">{title}</h3>
      <svg viewBox={`0 0 ${totalSize} ${totalSize}`} className="w-full max-w-md border-2 border-border rounded-lg bg-card">
        {/* Draw cells */}
        {CHART_POSITIONS.map(({ rasi, col, row }) => {
          const x = gap + col * (cellSize + gap);
          const y = gap + row * (cellSize + gap);
          const isLagna = rasi === lagna;
          const rasiPlanets = planetsByRasi[rasi] || [];
          const rasiInfo = RASI_NAMES[rasi];

          return (
            <g key={rasi}>
              <rect
                x={x} y={y} width={cellSize} height={cellSize}
                fill={isLagna ? "hsl(25 90% 50% / 0.1)" : "hsl(45 40% 98%)"}
                stroke="hsl(45 30% 85%)" strokeWidth="1"
                rx="4"
              />
              {/* Rasi name */}
              <text x={x + cellSize / 2} y={y + 14} textAnchor="middle" fontSize="8" fill="hsl(15 25% 40%)">
                {rasiInfo.ta}
              </text>
              {/* Lagna marker */}
              {isLagna && (
                <text x={x + 6} y={y + 14} fontSize="8" fontWeight="bold" fill="hsl(25 90% 50%)">
                  Lg
                </text>
              )}
              {/* Planets */}
              {rasiPlanets.map((p, i) => (
                <text
                  key={p.planet}
                  x={x + 8 + (i % 3) * 26}
                  y={y + 32 + Math.floor(i / 3) * 18}
                  fontSize="10"
                  fontWeight="600"
                  fill={p.planet === "Sun" ? "hsl(25 90% 50%)" :
                        p.planet === "Moon" ? "hsl(210 60% 50%)" :
                        p.planet === "Mars" ? "hsl(0 70% 50%)" :
                        p.planet === "Saturn" ? "hsl(240 20% 30%)" :
                        p.planet === "Rahu" || p.planet === "Ketu" ? "hsl(15 25% 40%)" :
                        "hsl(15 40% 15%)"}
                >
                  {p.tamilName.slice(0, 3)}
                </text>
              ))}
              {/* Degree */}
              {rasiPlanets.length > 0 && (
                <text x={x + cellSize / 2} y={y + cellSize - 6} textAnchor="middle" fontSize="6" fill="hsl(15 25% 40%)" opacity="0.6">
                  {rasiPlanets.map(p => `${p.degree.toFixed(0)}°`).join(" ")}
                </text>
              )}
            </g>
          );
        })}

        {/* Center label */}
        <rect
          x={gap + (cellSize + gap)} y={gap + (cellSize + gap)}
          width={cellSize * 2 + gap} height={cellSize * 2 + gap}
          fill="hsl(45 30% 95%)" stroke="hsl(45 30% 85%)" strokeWidth="1" rx="4"
        />
        <text x={totalSize / 2} y={totalSize / 2 - 8} textAnchor="middle" fontSize="14" fontWeight="bold" fill="hsl(25 90% 50%)">
          {title}
        </text>
        <text x={totalSize / 2} y={totalSize / 2 + 12} textAnchor="middle" fontSize="10" fill="hsl(15 25% 40%)">
          {RASI_NAMES[lagna].ta} லக்னம்
        </text>
      </svg>
    </div>
  );
}
