import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const types = [
  { label: "தினசரி", labelEn: "Daily", href: "/rasi?type=daily" },
  { label: "வாராந்திர", labelEn: "Weekly", href: "/rasi?type=weekly" },
  { label: "மாதாந்திர", labelEn: "Monthly", href: "/rasi?type=monthly" },
  { label: "ஆண்டு", labelEn: "Yearly", href: "/rasi?type=yearly" },
];

export function HoroscopeTypeSelector() {
  return (
    <section className="py-8 bg-muted/30">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-3">
          {types.map((type) => (
            <Link key={type.labelEn} to={type.href}>
              <Button variant="outline" className="font-tamil gap-1">
                {type.label} <span className="text-xs text-muted-foreground">({type.labelEn})</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
