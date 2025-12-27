/**
 * Time.ir API integration for Persian calendar events and holidays
 */

const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://api.time.ir/v1/event/fa/events/calendar';
const FALLBACK_URL = 'https://api.allorigins.win/get?url=';

/**
 * Fetch Persian calendar events for a specific month
 * @param {number} year - Persian year (e.g., 1404)
 * @param {number} month - Persian month (1-12)
 * @param {number} day - Day (0 for entire month)
 * @returns {Promise<Object>} Calendar data with events
 */
export const fetchPersianCalendarEvents = async (year, month, day = 0) => {
  const originalUrl = `https://api.time.ir/v1/event/fa/events/calendar?year=${year}&month=${month}&day=${day}&base1=0&base2=1&base3=2`;
  
  try {
    // Use AllOrigins proxy
    const proxyUrl = `${FALLBACK_URL}${encodeURIComponent(originalUrl)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Proxy error! status: ${response.status}`);
    }
    
    const proxyData = await response.json();
    // Decode HTML entities
    const decodedContent = proxyData.contents
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'");
    return JSON.parse(decodedContent);
  } catch (error) {
    // console.error('API call failed:', error);
    throw error;
  }
};

/**
 * Transform API events to calendar-compatible format
 * @param {Array} events - Events from API
 * @returns {Array} Formatted events
 */
export const transformEvents = (events) => {
  return events.map(event => {
    // Convert Jalali to Gregorian for date field
    const gDate = jalaliToGregorian(event.jalali_year, event.jalali_month, event.jalali_day);
    return {
      id: event.id,
      title: event.title,
      date: `${gDate.gy}-${String(gDate.gm).padStart(2, '0')}-${String(gDate.gd).padStart(2, '0')}`,
      isHoliday: event.is_holiday,
      isRecurring: event.reoccur,
      description: event.body ? event.body.replace(/<[^>]*>/g, '').substring(0, 200) : '',
      calendar: event.base === 0 ? 'persian' : event.base === 1 ? 'gregorian' : 'hijri',
      media: event.media,
      color: event.is_holiday ? '#ef4444' : '#10b981'
    };
  });
};

function jalaliToGregorian(jy, jm, jd) {
  let gy = (jy <= 979) ? 621 : 1600;
  jy -= (jy <= 979) ? 0 : 979;
  let days = (365 * jy) + ((Math.floor(jy / 33)) * 8) + (Math.floor(((jy % 33) + 3) / 4)) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  let leap = true;
  if (days >= 36525) {
    days--;
    gy += 100 * Math.floor(days / 36524);
    days %= 36524;
    if (days >= 365) days++;
    else leap = false;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days >= 366) {
    leap = false;
    days--;
    gy += Math.floor(days / 365);
    days %= 365;
  }
  const sal_a = [0, 31, ((leap || ((gy % 100 !== 0) && (gy % 4 === 0)) || (gy % 400 === 0)) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 0; gm < 13 && days >= sal_a[gm]; gm++) days -= sal_a[gm];
  const gd = days + 1;
  return { gy, gm, gd };
}

/**
 * Get holidays for a specific Persian month
 * @param {number} year - Persian year
 * @param {number} month - Persian month
 * @returns {Promise<Array>} Array of holidays
 */
export const getHolidays = async (year, month) => {
  try {
    const data = await fetchPersianCalendarEvents(year, month);
    const holidays = data.data.event_list.filter(event => event.is_holiday);
    return transformEvents(holidays);
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
};

/**
 * Check if a specific date is a holiday
 * @param {number} year - Persian year
 * @param {number} month - Persian month  
 * @param {number} day - Persian day
 * @returns {Promise<boolean>} True if holiday
 */
export const isHoliday = async (year, month, day) => {
  try {
    const data = await fetchPersianCalendarEvents(year, month, day);
    const dayData = data.data.day_list.find(d => d.index_in_base1 === day);
    return dayData ? dayData.is_holiday : false;
  } catch (error) {
    console.error('Error checking holiday status:', error);
    return false;
  }
};