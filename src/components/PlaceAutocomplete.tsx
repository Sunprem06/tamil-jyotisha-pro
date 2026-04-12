import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { INDIAN_CITIES, type CityData } from "@/data/indianCities";
import { MapPin, Loader2 } from "lucide-react";

interface PlaceAutocompleteProps {
  value: string;
  onChange: (place: string, lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
}

interface GeoResult {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export function PlaceAutocomplete({ value, onChange, placeholder = "இடத்தை தேடுங்கள்...", className }: PlaceAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchOnline = useCallback(async (text: string): Promise<GeoResult[]> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text + ", India")}&format=json&limit=8&countrycodes=in&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data.map((item: any) => ({
        name: item.address?.suburb || item.address?.city || item.address?.town || item.address?.village || item.name || text,
        state: item.address?.state || item.address?.state_district || "",
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
    } catch {
      return [];
    }
  }, []);

  const handleInputChange = (text: string) => {
    setQuery(text);
    setHighlightIdx(-1);

    if (text.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Instant local results
    const lower = text.toLowerCase();
    const localResults: GeoResult[] = INDIAN_CITIES
      .filter(c => c.name.toLowerCase().includes(lower) || c.state.toLowerCase().includes(lower))
      .slice(0, 5)
      .map(c => ({ name: c.name, state: c.state, lat: c.lat, lng: c.lng }));

    setSuggestions(localResults);
    setShowDropdown(localResults.length > 0);

    // Debounced online search for places not in local DB
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const onlineResults = await searchOnline(text);
      setIsSearching(false);

      if (onlineResults.length > 0) {
        // Merge: local first, then online (deduplicated)
        const localNames = new Set(localResults.map(r => `${r.lat.toFixed(2)},${r.lng.toFixed(2)}`));
        const uniqueOnline = onlineResults.filter(r => !localNames.has(`${r.lat.toFixed(2)},${r.lng.toFixed(2)}`));
        const merged = [...localResults, ...uniqueOnline].slice(0, 10);
        setSuggestions(merged);
        setShowDropdown(merged.length > 0);
      }
    }, 400);
  };

  const selectCity = (city: GeoResult) => {
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
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((city, idx) => (
            <button
              key={`${city.name}-${city.lat}-${city.lng}`}
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
          {isSearching && (
            <div className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" /> தேடுகிறது...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
