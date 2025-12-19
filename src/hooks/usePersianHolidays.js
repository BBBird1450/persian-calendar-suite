import { useState, useEffect } from 'react';
import { getHolidays } from '../services/timeIrApi.js';

/**
 * React hook to fetch Persian holidays for calendar integration
 * @param {number} year - Persian year
 * @param {number} month - Persian month
 * @returns {Object} { holidays, loading, error }
 */
export const usePersianHolidays = (year, month) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!year || !month) return;

    const fetchHolidays = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const holidayData = await getHolidays(year, month);
        
        // Transform to calendar event format
        const calendarHolidays = holidayData.map(holiday => ({
          id: `holiday-${holiday.id}`,
          title: holiday.title,
          date: holiday.date.replace(/\//g, '-'), // Convert to YYYY-MM-DD format
          isHoliday: true,
          isAllDay: true,
          color: '#ef4444',
          description: holiday.description,
          readOnly: true // Holidays cannot be edited
        }));
        
        setHolidays(calendarHolidays);
      } catch (err) {
        setError(err.message);
        setHolidays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [year, month]);

  return { holidays, loading, error };
};