export interface Rasi {
  id: string;
  name: string;
  tamilName: string;
  symbol: string;
  element: string;
  ruling: string;
  dates: string;
  color: string;
}

export const rasiData: Rasi[] = [
  { id: "mesham", name: "Aries", tamilName: "மேஷம்", symbol: "♈", element: "Fire", ruling: "Mars", dates: "Apr 14 - May 14", color: "from-red-500 to-orange-500" },
  { id: "rishabam", name: "Taurus", tamilName: "ரிஷபம்", symbol: "♉", element: "Earth", ruling: "Venus", dates: "May 15 - Jun 14", color: "from-green-600 to-emerald-500" },
  { id: "mithunam", name: "Gemini", tamilName: "மிதுனம்", symbol: "♊", element: "Air", ruling: "Mercury", dates: "Jun 15 - Jul 16", color: "from-yellow-500 to-amber-500" },
  { id: "kadagam", name: "Cancer", tamilName: "கடகம்", symbol: "♋", element: "Water", ruling: "Moon", dates: "Jul 17 - Aug 16", color: "from-blue-400 to-cyan-500" },
  { id: "simmam", name: "Leo", tamilName: "சிம்மம்", symbol: "♌", element: "Fire", ruling: "Sun", dates: "Aug 17 - Sep 16", color: "from-orange-500 to-yellow-500" },
  { id: "kanni", name: "Virgo", tamilName: "கன்னி", symbol: "♍", element: "Earth", ruling: "Mercury", dates: "Sep 17 - Oct 17", color: "from-emerald-500 to-green-600" },
  { id: "thulam", name: "Libra", tamilName: "துலாம்", symbol: "♎", element: "Air", ruling: "Venus", dates: "Oct 18 - Nov 15", color: "from-pink-500 to-rose-500" },
  { id: "viruchigam", name: "Scorpio", tamilName: "விருச்சிகம்", symbol: "♏", element: "Water", ruling: "Mars", dates: "Nov 16 - Dec 15", color: "from-red-700 to-red-500" },
  { id: "dhanusu", name: "Sagittarius", tamilName: "தனுசு", symbol: "♐", element: "Fire", ruling: "Jupiter", dates: "Dec 16 - Jan 13", color: "from-purple-500 to-indigo-500" },
  { id: "magaram", name: "Capricorn", tamilName: "மகரம்", symbol: "♑", element: "Earth", ruling: "Saturn", dates: "Jan 14 - Feb 12", color: "from-gray-600 to-slate-500" },
  { id: "kumbam", name: "Aquarius", tamilName: "கும்பம்", symbol: "♒", element: "Air", ruling: "Saturn", dates: "Feb 13 - Mar 14", color: "from-blue-600 to-indigo-500" },
  { id: "meenam", name: "Pisces", tamilName: "மீனம்", symbol: "♓", element: "Water", ruling: "Jupiter", dates: "Mar 15 - Apr 13", color: "from-teal-500 to-cyan-500" },
];

export const currentPanchangam = {
  date: new Date().toLocaleDateString('ta-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
  day: new Date().toLocaleDateString('ta-IN', { weekday: 'long' }),
  sunrise: "06:05",
  sunset: "18:25",
  tithi: "சதுர்த்தி",
  nakshatra: "ரோகிணி",
  yoga: "சுபம்",
  rahuKalam: "07:30 - 09:00",
  yamagandam: "10:30 - 12:00",
  gulikai: "13:30 - 15:00",
};
