// Tamil Nadu & Indian holidays data - dynamically computed per year
export interface Holiday {
  date: string; // MM-DD format
  name_tamil: string;
  name_english: string;
  type: 'government' | 'festival' | 'national' | 'state' | 'vratham';
}

export function getHolidaysForYear(year: number): Holiday[] {
  return [
    // National Holidays
    { date: '01-26', name_tamil: 'குடியரசு தினம்', name_english: 'Republic Day', type: 'national' },
    { date: '08-15', name_tamil: 'சுதந்திர தினம்', name_english: 'Independence Day', type: 'national' },
    { date: '10-02', name_tamil: 'காந்தி ஜயந்தி', name_english: 'Gandhi Jayanti', type: 'national' },

    // Government / State Holidays
    { date: '01-01', name_tamil: 'புத்தாண்டு', name_english: 'New Year', type: 'government' },
    { date: '01-15', name_tamil: 'பொங்கல் / தை பொங்கல்', name_english: 'Pongal', type: 'state' },
    { date: '01-16', name_tamil: 'திருவள்ளுவர் தினம்', name_english: 'Thiruvalluvar Day', type: 'state' },
    { date: '01-17', name_tamil: 'உழவர் திருநாள்', name_english: 'Uzhavar Thirunal', type: 'state' },
    { date: '04-14', name_tamil: 'தமிழ் புத்தாண்டு', name_english: 'Tamil New Year', type: 'state' },
    { date: '05-01', name_tamil: 'தொழிலாளர் தினம்', name_english: 'May Day', type: 'government' },
    { date: '07-18', name_tamil: 'ஆடி பெருக்கு', name_english: 'Aadi Perukku', type: 'state' },
    { date: '11-01', name_tamil: 'தீபாவளி', name_english: 'Deepavali', type: 'festival' },

    // Festival Holidays
    { date: '01-14', name_tamil: 'போகி', name_english: 'Bhogi', type: 'festival' },
    { date: '02-26', name_tamil: 'மகா சிவராத்திரி', name_english: 'Maha Shivaratri', type: 'festival' },
    { date: '03-14', name_tamil: 'ஹோலி', name_english: 'Holi', type: 'festival' },
    { date: '04-06', name_tamil: 'உகாதி / குடி முழுக்கு', name_english: 'Ugadi', type: 'festival' },
    { date: '04-10', name_tamil: 'ஸ்ரீ ராம நவமி', name_english: 'Sri Rama Navami', type: 'festival' },
    { date: '08-16', name_tamil: 'ஸ்ரீ கிருஷ்ண ஜெயந்தி', name_english: 'Krishna Jayanthi', type: 'festival' },
    { date: '08-26', name_tamil: 'விநாயகர் சதுர்த்தி', name_english: 'Vinayagar Chaturthi', type: 'festival' },
    { date: '09-29', name_tamil: 'நவராத்திரி தொடக்கம்', name_english: 'Navaratri Begins', type: 'festival' },
    { date: '10-08', name_tamil: 'விஜயதசமி / சரஸ்வதி பூஜை', name_english: 'Vijayadashami', type: 'festival' },
    { date: '10-20', name_tamil: 'கார்த்திகை தீபம்', name_english: 'Karthigai Deepam', type: 'festival' },
    { date: '12-25', name_tamil: 'கிறிஸ்துமஸ்', name_english: 'Christmas', type: 'festival' },

    // Important Vratham Days
    { date: '01-10', name_tamil: 'வைகுண்ட ஏகாதசி', name_english: 'Vaikuntha Ekadashi', type: 'vratham' },
    { date: '02-11', name_tamil: 'தைப்பூசம்', name_english: 'Thaipusam', type: 'vratham' },
    { date: '03-01', name_tamil: 'மாசி மகம்', name_english: 'Masi Magam', type: 'vratham' },
    { date: '07-29', name_tamil: 'ஆடி அமாவாசை', name_english: 'Aadi Amavasai', type: 'vratham' },
    { date: '08-09', name_tamil: 'ஆவணி அவிட்டம்', name_english: 'Avani Avittam', type: 'vratham' },
    { date: '10-17', name_tamil: 'ஐப்பசி அமாவாசை', name_english: 'Aippasi Amavasai', type: 'vratham' },
    { date: '11-15', name_tamil: 'கார்த்திகை சோமவாரம்', name_english: 'Karthigai Monday', type: 'vratham' },
    { date: '12-11', name_tamil: 'மார்கழி ஏகாதசி', name_english: 'Margazhi Ekadashi', type: 'vratham' },
  ];
}

export function getHolidaysForDate(date: Date): Holiday[] {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const key = `${mm}-${dd}`;
  return getHolidaysForYear(date.getFullYear()).filter(h => h.date === key);
}

export function getHolidayTypeColor(type: Holiday['type']): string {
  switch (type) {
    case 'national': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'government': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'state': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'festival': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'vratham': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
  }
}

export function getHolidayTypeLabel(type: Holiday['type']): string {
  switch (type) {
    case 'national': return 'தேசிய விடுமுறை';
    case 'government': return 'அரசு விடுமுறை';
    case 'state': return 'மாநில விடுமுறை';
    case 'festival': return 'பண்டிகை';
    case 'vratham': return 'விரதம்';
  }
}
