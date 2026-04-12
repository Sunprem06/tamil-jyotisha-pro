import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { INDIAN_CITIES, type CityData } from "@/data/indianCities";
import { MapPin } from "lucide-react";

interface PlaceAutocompleteProps {
  value: string;
  onChange: (place: string, lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
}

export function PlaceAutocomplete({ value, onChange, placeholder = "இடத்தை தேடுங்கள்...", className }: PlaceAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (text: string) => {
    setQuery(text);
    setHighlightIdx(-1);
    if (text.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const lower = text.toLowerCase();
    const filtered = INDIAN_CITIES.filter(
      c => c.name.toLowerCase().includes(lower) || c.state.toLowerCase().includes(lower)
    ).slice(0, 10);
    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const selectCity = (city: CityData) => {
    setQuery(city.name);
    setShowDropdown(false);
    onChange(city.name, city.lat, city.lng);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      e.preventDefault();
      selectCity(suggestions[highlightIdx]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className || ""}`}>
      <Input
        type="text"
        value={query}
        onChange={e => handleInputChange(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((city, idx) => (
            <button
              key={`${city.name}-${city.state}`}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent/50 transition-colors ${idx === highlightIdx ? "bg-accent/50" : ""}`}
              onClick={() => selectCity(city)}
              onMouseEnter={() => setHighlightIdx(idx)}
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium">{city.name}</span>
              <span className="text-muted-foreground text-xs ml-auto">{city.state}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
