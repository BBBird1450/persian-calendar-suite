import React, { useState, useEffect } from 'react';
import PersianDateTimePicker from './PersianDateTimePicker.jsx';
import PersianTimePicker from './PersianTimePicker.jsx';
import { usePersianHolidays } from './hooks/usePersianHolidays.js';

const PersianCalendar = ({ 
  events = [],
  onEventClick,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  theme = {},
  initialView = 'month',
  showWeekends = true,
  headerFormat = 'full',
  editable = true,
  disabledHours = [],
  showHolidays = true
}) => {
  const defaultTheme = {
    primaryColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderColor: '#e8e8e8',
    textColor: '#000000',
    headerBg: '#fafafa',
    eventRadius: '6px',
    shadow: '0 2px 8px rgba(0,0,0,0.08)',
    ...theme
  };

  const [viewMode, setViewMode] = useState(initialView);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState({ year: 1404, month: 9 });
  const [currentDay, setCurrentDay] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(0);

  const [showEventModal, setShowEventModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [holidayModalClosing, setHolidayModalClosing] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', startTime: '', endTime: '', color: defaultTheme.primaryColor, description: '', isAllDay: false, isRecurring: false, recurringType: 'daily', recurringEnd: '', isMultiDay: false, endDate: '' });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [showRecurringEndPicker, setShowRecurringEndPicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  const weekDaysShort = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const displayWeekDays = headerFormat === 'short' ? weekDaysShort : weekDays;
  const filteredWeekDays = showWeekends ? displayWeekDays : displayWeekDays.slice(0, 5);
  const gridCols = showWeekends ? 7 : 5;

  // Fetch holidays for current month
  const { holidays, loading: holidaysLoading } = usePersianHolidays(
    showHolidays ? displayMonth.year : null, 
    showHolidays ? displayMonth.month : null
  );

  // Combine user events with holidays
  const allEvents = showHolidays ? [...events, ...holidays] : events;

  useEffect(() => {
    const jalali = gregorianToJalali(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    setDisplayMonth({ year: jalali.jy, month: jalali.jm });
  }, [currentDate]);



  const gregorianToJalali = (gy, gm, gd) => {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + (Math.floor((gy2 + 3) / 4)) - (Math.floor((gy2 + 99) / 100)) + (Math.floor((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return { jy, jm, jd };
  };

  const jalaliToGregorian = (jy, jm, jd) => {
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
  };

  const getDaysInMonth = (year, month) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    const isLeap = ((year - 979) % 33) % 4 === 1;
    return isLeap ? 30 : 29;
  };

  const getFirstDayOfMonth = (year, month) => {
    const greg = jalaliToGregorian(year, month, 1);
    const date = new Date(greg.gy, greg.gm - 1, greg.gd);
    return (date.getDay() + 1) % 7;
  };

  const getEventsForDate = (year, month, day) => {
    const greg = jalaliToGregorian(year, month, day);
    const dateStr = `${greg.gy}-${String(greg.gm).padStart(2, '0')}-${String(greg.gd).padStart(2, '0')}`;
    return allEvents.filter(e => e.date?.startsWith(dateStr));
  };

  const handleSlotClick = (year, month, day, hour) => {
    if (!editable) return;
    const greg = jalaliToGregorian(year, month, day);
    const dateStr = `${greg.gy}-${String(greg.gm).padStart(2, '0')}-${String(greg.gd).padStart(2, '0')}`;
    setSelectedSlot({ date: dateStr, hour, year, month, day });
    setEventForm({ title: '', startTime: `${String(hour).padStart(2, '0')}:00`, endTime: `${String(hour + 1).padStart(2, '0')}:00`, color: defaultTheme.primaryColor, description: '', isAllDay: false, isRecurring: false, recurringType: 'daily', recurringEnd: '', isMultiDay: false, endDate: '' });
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (event, e) => {
    e?.stopPropagation();
    if (event.isHoliday) {
      setSelectedHoliday(event);
      setShowHolidayModal(true);
      onEventClick?.(event);
      return;
    }
    if (!editable || event.readOnly) {
      onEventClick?.(event);
      return;
    }
    setEditingEvent(event);
    setEventForm({ 
      title: event.title, 
      startTime: event.startTime || event.time || '00:00', 
      endTime: event.endTime || '01:00', 
      color: event.color || defaultTheme.primaryColor, 
      description: event.description || '',
      isAllDay: event.isAllDay || false,
      isRecurring: event.isRecurring || false,
      recurringType: event.recurringType || 'daily',
      recurringEnd: event.recurringEnd || '',
      isMultiDay: event.isMultiDay || false,
      endDate: event.endDate || ''
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.title.trim()) return;
    
    const eventData = {
      ...eventForm,
      date: editingEvent?.date || selectedSlot?.date,
      time: eventForm.startTime,
      id: editingEvent?.id || Date.now()
    };

    if (editingEvent) {
      onEventUpdate?.({ ...editingEvent, ...eventData });
    } else {
      onEventCreate?.(eventData);
    }
    
    closeModal();
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      onEventDelete?.(editingEvent);
      closeModal();
    }
  };

  const closeModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowEventModal(false);
      setModalClosing(false);
      setEventForm({ title: '', startTime: '', endTime: '', color: defaultTheme.primaryColor, description: '', isAllDay: false, isRecurring: false, recurringType: 'daily', recurringEnd: '', isMultiDay: false, endDate: '' });
      setEditingEvent(null);
    }, 200);
  };

  const closeHolidayModal = () => {
    setHolidayModalClosing(true);
    setTimeout(() => {
      setShowHolidayModal(false);
      setHolidayModalClosing(false);
      setSelectedHoliday(null);
    }, 200);
  };

  const getOverlappingEvents = (year, month, day, hour) => {
    const dayEvents = getEventsForDate(year, month, day);
    return dayEvents.filter(e => {
      if (!e.startTime && !e.time) return false;
      const start = e.startTime || e.time;
      const end = e.endTime;
      const startHour = parseInt(start.split(':')[0]);
      const endHour = end ? parseInt(end.split(':')[0]) : startHour + 1;
      return hour >= startHour && hour < endHour;
    });
  };

  const changeMonth = (delta) => {
    let newMonth = displayMonth.month + delta;
    let newYear = displayMonth.year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setDisplayMonth({ year: newYear, month: newMonth });
  };

  const changeDay = (delta) => {
    const daysInMonth = getDaysInMonth(displayMonth.year, displayMonth.month);
    let newDay = currentDay + delta;
    let newMonth = displayMonth.month;
    let newYear = displayMonth.year;
    
    if (newDay > daysInMonth) {
      newDay = 1;
      newMonth++;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
    } else if (newDay < 1) {
      newMonth--;
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      newDay = getDaysInMonth(newYear, newMonth);
    }
    
    setCurrentDay(newDay);
    setDisplayMonth({ year: newYear, month: newMonth });
  };

  const changeWeek = (delta) => {
    const newWeek = currentWeek + delta;
    const weeksInMonth = Math.ceil((getDaysInMonth(displayMonth.year, displayMonth.month) + getFirstDayOfMonth(displayMonth.year, displayMonth.month)) / 7);
    
    if (newWeek >= weeksInMonth) {
      setCurrentWeek(0);
      changeMonth(1);
    } else if (newWeek < 0) {
      changeMonth(-1);
      const prevWeeks = Math.ceil((getDaysInMonth(displayMonth.year, displayMonth.month - 1 || 12) + getFirstDayOfMonth(displayMonth.year, displayMonth.month - 1 || 12)) / 7);
      setCurrentWeek(prevWeeks - 1);
    } else {
      setCurrentWeek(newWeek);
    }
  };

  const getNavigationText = () => {
    if (viewMode === 'day') {
      const greg = jalaliToGregorian(displayMonth.year, displayMonth.month, currentDay);
      const date = new Date(greg.gy, greg.gm - 1, greg.gd);
      const dayOfWeek = (date.getDay() + 1) % 7;
      return `${weekDays[dayOfWeek]} ${currentDay} ${persianMonths[displayMonth.month - 1]} ${displayMonth.year}`;
    } else if (viewMode === 'week') {
      return `هفته ${currentWeek + 1} از ${persianMonths[displayMonth.month - 1]} ${displayMonth.year}`;
    }
    return `${persianMonths[displayMonth.month - 1]} ${displayMonth.year}`;
  };

  const handleNavigation = (delta) => {
    if (viewMode === 'day') changeDay(delta);
    else if (viewMode === 'week') changeWeek(delta);
    else changeMonth(delta);
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(displayMonth.year, displayMonth.month);
    const firstDay = getFirstDayOfMonth(displayMonth.year, displayMonth.month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      if (!showWeekends && (i === 5 || i === 6)) continue;
      days.push(<div key={`empty-${i}`} style={{ minHeight: isMobile ? '50px' : '100px', border: `1px solid ${defaultTheme.borderColor}`, background: '#fafafa', transition: 'all 0.2s' }} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const greg = jalaliToGregorian(displayMonth.year, displayMonth.month, day);
      const date = new Date(greg.gy, greg.gm - 1, greg.gd);
      const dayOfWeek = (date.getDay() + 1) % 7;
      if (!showWeekends && (dayOfWeek === 5 || dayOfWeek === 6)) continue;
      
      const dayEvents = getEventsForDate(displayMonth.year, displayMonth.month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isHoliday = dayEvents.some(e => e.isHoliday);
      
      days.push(
        <div key={day} className="calendar-day-cell" style={{ minHeight: isMobile ? '50px' : '100px', border: `1px solid ${defaultTheme.borderColor}`, padding: isMobile ? '2px' : '8px', background: isHoliday ? '#fff1f0' : isToday ? `${defaultTheme.primaryColor}08` : defaultTheme.backgroundColor, overflow: 'hidden', transition: 'all 0.2s', cursor: editable ? 'pointer' : 'default' }} onMouseEnter={(e) => e.currentTarget.style.background = `${defaultTheme.primaryColor}15`} onMouseLeave={(e) => e.currentTarget.style.background = isHoliday ? '#fff1f0' : isToday ? `${defaultTheme.primaryColor}08` : defaultTheme.backgroundColor} onClick={(e) => { if (e.target === e.currentTarget) handleSlotClick(displayMonth.year, displayMonth.month, day, 9); }}>
          <div className="calendar-day-number" style={{ fontWeight: 'bold', marginBottom: isMobile ? '2px' : '8px', color: isHoliday ? '#f5222d' : isToday ? defaultTheme.primaryColor : defaultTheme.textColor, fontSize: isMobile ? '10px' : '14px' }}>{day}</div>
          {dayEvents.map((event, i) => (
            <div
              key={i}
              onClick={(e) => handleEventClick(event, e)}
              title={`${event.title}${event.description ? ' - ' + event.description : ''}${event.isAllDay ? ' (تمام روز)' : ''}${event.isRecurring ? ' (تکراری)' : ''}`}
              className="calendar-event"
              style={{
                background: event.isAllDay ? `linear-gradient(45deg, ${event.color || defaultTheme.primaryColor}, ${event.color || defaultTheme.primaryColor}aa)` : event.color || defaultTheme.primaryColor,
                color: '#fff',
                padding: event.isAllDay ? (isMobile ? '1px 2px' : '6px 8px') : (isMobile ? '1px 2px' : '4px 6px'),
                marginBottom: isMobile ? '1px' : '4px',
                borderRadius: isMobile ? '2px' : defaultTheme.eventRadius,
                fontSize: isMobile ? '8px' : '11px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'all 0.2s',
                boxShadow: isMobile ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                border: event.isAllDay ? (isMobile ? '1px dashed rgba(255,255,255,0.7)' : '2px dashed rgba(255,255,255,0.5)') : 'none',
                fontWeight: event.isAllDay ? 'bold' : 'normal',
                animation: event.isNew ? 'eventAdd 0.3s ease-out' : event.isDeleting ? 'eventRemove 0.3s ease-out' : 'none',
                lineHeight: isMobile ? '1.2' : '1.4'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              {isMobile ? (
                event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title
              ) : (
                <>{event.isAllDay ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '4px'}}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> : event.time && `${event.time} `}{event.title}{event.isRecurring ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft: '4px'}}><path d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5a7.5 7.5 0 1 1-7.5-7.5z"/></svg> : ''}</>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '0', animation: 'fadeIn 0.3s ease-in-out' }}>
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const firstDay = getFirstDayOfMonth(displayMonth.year, displayMonth.month);
    const daysInMonth = getDaysInMonth(displayMonth.year, displayMonth.month);
    const weekStartDay = Math.max(1, (currentWeek * 7) - firstDay + 1);
    const weekEndDay = Math.min(daysInMonth, weekStartDay + 6);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    const weekDays = [];
    for (let d = weekStartDay; d <= weekEndDay; d++) {
      weekDays.push(d);
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${weekDays.length}, 1fr)`, borderBottom: `2px solid ${defaultTheme.borderColor}` }}>
          <div style={{ padding: '8px', background: defaultTheme.headerBg }} />
          {weekDays.map((day) => {
            const greg = jalaliToGregorian(displayMonth.year, displayMonth.month, day);
            const date = new Date(greg.gy, greg.gm - 1, greg.gd);
            const dayOfWeek = (date.getDay() + 1) % 7;
            return (
              <div key={day} className="calendar-weekday-header" style={{ padding: isMobile ? '6px 2px' : '8px', textAlign: 'center', background: defaultTheme.headerBg, borderLeft: `1px solid ${defaultTheme.borderColor}`, fontSize: isMobile ? '10px' : '14px' }}>
                <div style={{ fontWeight: 'bold', fontSize: isMobile ? '10px' : '14px' }}>{filteredWeekDays[dayOfWeek]}</div>
                <div style={{ fontSize: isMobile ? '9px' : '12px', color: '#999' }}>{day}</div>
              </div>
            );
          })}
        </div>
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {hours.map(hour => (
            <div key={hour} style={{ display: 'grid', gridTemplateColumns: `60px repeat(${weekDays.length}, 1fr)`, borderBottom: `1px solid ${defaultTheme.borderColor}` }}>
              <div style={{ padding: '8px', fontSize: '12px', color: '#999', textAlign: 'right', background: defaultTheme.headerBg }}>{String(hour).padStart(2, '0')}:00</div>
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(displayMonth.year, displayMonth.month, day).filter(e => {
                  if (!e.time && !e.startTime) return false;
                  const eventHour = parseInt((e.startTime || e.time).split(':')[0]);
                  return eventHour === hour;
                });

                return (
                  <div key={day} style={{ padding: '4px', minHeight: '50px', borderLeft: `1px solid ${defaultTheme.borderColor}`, cursor: editable ? 'pointer' : 'default' }} onClick={() => handleSlotClick(displayMonth.year, displayMonth.month, day, hour)}>
                    {dayEvents.map((event, i) => (
                      <div
                        key={i}
                        onClick={(e) => handleEventClick(event, e)}
                        title={`${event.title}${event.description ? ' - ' + event.description : ''}${event.isAllDay ? ' (تمام روز)' : ''}${event.isRecurring ? ' (تکراری)' : ''}`}
                        style={{
                          background: event.isAllDay ? `linear-gradient(45deg, ${event.color || defaultTheme.primaryColor}, ${event.color || defaultTheme.primaryColor}aa)` : event.color || defaultTheme.primaryColor,
                          color: '#fff',
                          padding: event.isAllDay ? '8px' : '6px',
                          marginBottom: '2px',
                          borderRadius: defaultTheme.eventRadius,
                          fontSize: '11px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          border: event.isAllDay ? '2px dashed rgba(255,255,255,0.5)' : 'none',
                          fontWeight: event.isAllDay ? 'bold' : 'normal'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        }}
                      >
                        {event.isAllDay ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '4px'}}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> : ''}{event.title}{event.isRecurring ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft: '4px'}}><path d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5a7.5 7.5 0 1 1-7.5-7.5z"/></svg> : ''}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {hours.map(hour => {
          const overlappingEvents = getOverlappingEvents(displayMonth.year, displayMonth.month, currentDay, hour);
          const hasOverlap = overlappingEvents.length > 1;
          const isDisabled = disabledHours.includes(hour);

          return (
            <div key={hour} style={{ display: 'flex', borderBottom: `1px solid ${defaultTheme.borderColor}`, minHeight: '80px', background: isDisabled ? '#f5f5f5' : hasOverlap ? '#fff7e6' : 'transparent', opacity: isDisabled ? 0.6 : 1 }}>
              <div style={{ width: '80px', padding: '8px', fontSize: '14px', color: '#999', textAlign: 'right', borderLeft: `1px solid ${defaultTheme.borderColor}`, background: defaultTheme.headerBg }}>
                {String(hour).padStart(2, '0')}:00
              </div>
              <div 
                style={{ flex: 1, padding: '4px', cursor: editable && !isDisabled ? 'pointer' : 'default', position: 'relative' }}
                onClick={() => !isDisabled && handleSlotClick(displayMonth.year, displayMonth.month, currentDay, hour)}
              >
                {isDisabled && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#999', fontSize: '12px', fontWeight: 'bold' }}>
                    غیرفعال
                  </div>
                )}
                {hasOverlap && (
                  <div style={{ position: 'absolute', top: '4px', right: '4px', background: '#fa8c16', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                    {overlappingEvents.length} تداخل
                  </div>
                )}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {overlappingEvents.map((event, i) => (
                    <div
                      key={i}
                      onClick={(e) => handleEventClick(event, e)}
                      title={`${event.title}${event.description ? ' - ' + event.description : ''}${event.isAllDay ? ' (تمام روز)' : ''}${event.isRecurring ? ' (تکراری)' : ''}`}
                      style={{
                        background: event.isAllDay ? `linear-gradient(45deg, ${event.color || defaultTheme.primaryColor}, ${event.color || defaultTheme.primaryColor}aa)` : event.color || defaultTheme.primaryColor,
                        color: '#fff',
                        padding: '12px',
                        borderRadius: defaultTheme.eventRadius,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: defaultTheme.shadow,
                        flex: hasOverlap ? `0 0 calc(${100 / overlappingEvents.length}% - 4px)` : '1',
                        minWidth: hasOverlap ? '120px' : 'auto',
                        border: event.isHoliday ? 'none' : event.isAllDay ? '3px dashed rgba(255,255,255,0.7)' : '2px solid rgba(255,255,255,0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = defaultTheme.shadow;
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{event.isAllDay ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '4px'}}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>تمام روز</> : `${event.startTime || event.time} - ${event.endTime || ''}`}</div>
                      <div style={{ marginTop: '4px' }}>{event.title}{event.isRecurring ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft: '4px'}}><path d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5a7.5 7.5 0 1 1-7.5-7.5z"/></svg> : ''}</div>
                      {event.description && <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.9 }}>{event.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{ background: defaultTheme.backgroundColor, borderRadius: isMobile ? '8px' : '12px', overflow: 'hidden', border: `1px solid ${defaultTheme.borderColor}`, boxShadow: defaultTheme.shadow, position: 'relative', width: '100%', maxWidth: '100%' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-20px); opacity: 0; } }
        @keyframes eventAdd { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes eventRemove { from { transform: scale(1); opacity: 1; } to { transform: scale(0.8); opacity: 0; } }
        @media (max-width: 768px) {
          .calendar-header { flex-direction: column; gap: 12px !important; }
          .calendar-nav-buttons { order: 2; }
          .calendar-title { order: 1; font-size: 16px !important; }
          .calendar-view-buttons { order: 3; }
          .calendar-grid { font-size: 12px; }
          .calendar-day-cell { min-height: 50px !important; padding: 2px !important; }
          .calendar-event { font-size: 8px !important; padding: 1px 2px !important; margin-bottom: 1px !important; }
          .calendar-day-number { font-size: 10px !important; margin-bottom: 2px !important; }
          .calendar-weekday-header { font-size: 10px !important; padding: 6px 2px !important; }
          .calendar-hour-label { font-size: 11px !important; }
          .calendar-time-slot { min-height: 40px !important; }
        }
      `}</style>
      <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '12px' : '20px', background: defaultTheme.headerBg, borderBottom: `2px solid ${defaultTheme.borderColor}` }}>
        <div className="calendar-nav-buttons" style={{ display: 'flex', gap: isMobile ? '4px' : '8px' }}>
          <button onClick={() => handleNavigation(-1)} style={{ padding: isMobile ? '6px 12px' : '8px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: defaultTheme.backgroundColor, cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500', fontSize: isMobile ? '12px' : '14px' }} onMouseEnter={(e) => e.currentTarget.style.background = defaultTheme.primaryColor + '15'} onMouseLeave={(e) => e.currentTarget.style.background = defaultTheme.backgroundColor}>بعدی</button>
          <button onClick={() => {
            const today = new Date();
            const jalali = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
            setDisplayMonth({ year: jalali.jy, month: jalali.jm });
            setCurrentDay(jalali.jd);
            setCurrentWeek(0);
          }} style={{ padding: isMobile ? '6px 12px' : '8px 16px', border: `1px solid ${defaultTheme.primaryColor}`, borderRadius: '6px', background: defaultTheme.primaryColor, color: '#fff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500', fontSize: isMobile ? '12px' : '14px' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>امروز</button>
          <button onClick={() => handleNavigation(1)} style={{ padding: isMobile ? '6px 12px' : '8px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: defaultTheme.backgroundColor, cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500', fontSize: isMobile ? '12px' : '14px' }} onMouseEnter={(e) => e.currentTarget.style.background = defaultTheme.primaryColor + '15'} onMouseLeave={(e) => e.currentTarget.style.background = defaultTheme.backgroundColor}>قبلی</button>
        </div>
        <div className="calendar-title" style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '20px', color: defaultTheme.textColor, direction: 'rtl', textAlign: 'center' }}>
          {getNavigationText()}
        </div>
        <div className="calendar-view-buttons" style={{ display: 'flex', gap: isMobile ? '2px' : '4px' }}>
          <button onClick={() => setViewMode('day')} style={{ padding: isMobile ? '6px 8px' : '8px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: viewMode === 'day' ? defaultTheme.primaryColor : defaultTheme.backgroundColor, color: viewMode === 'day' ? '#fff' : defaultTheme.textColor, cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500', fontSize: isMobile ? '12px' : '14px' }}>روز</button>
          <button onClick={() => setViewMode('week')} style={{ padding: isMobile ? '6px 8px' : '8px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: viewMode === 'week' ? defaultTheme.primaryColor : defaultTheme.backgroundColor, color: viewMode === 'week' ? '#fff' : defaultTheme.textColor, cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500', fontSize: isMobile ? '12px' : '14px' }}>هفته</button>
          <button onClick={() => setViewMode('month')} style={{ padding: isMobile ? '6px 8px' : '8px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: viewMode === 'month' ? defaultTheme.primaryColor : defaultTheme.backgroundColor, color: viewMode === 'month' ? '#fff' : defaultTheme.textColor, cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500', fontSize: isMobile ? '12px' : '14px' }}>ماه</button>
        </div>
      </div>

      {viewMode === 'month' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, background: defaultTheme.headerBg, borderBottom: `2px solid ${defaultTheme.borderColor}` }}>
            {filteredWeekDays.map((day, i) => (
              <div key={i} className="calendar-weekday-header" style={{ padding: isMobile ? '6px 2px' : '12px', textAlign: 'center', fontWeight: '600', borderLeft: i > 0 ? `1px solid ${defaultTheme.borderColor}` : 'none', fontSize: isMobile ? '10px' : '14px' }}>
                {day}
              </div>
            ))}
          </div>
          {renderMonthView()}
        </>
      )}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}

      {showEventModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: modalClosing ? 'fadeOut 0.2s' : 'fadeIn 0.2s', padding: isMobile ? '16px' : '0' }} onClick={closeModal}>
          <div style={{ background: defaultTheme.backgroundColor, borderRadius: isMobile ? '8px' : '12px', padding: isMobile ? '16px' : '24px', width: '100%', maxWidth: isMobile ? '100%' : '500px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', animation: modalClosing ? 'slideOut 0.2s' : 'slideIn 0.3s', direction: 'rtl', maxHeight: isMobile ? '90vh' : 'auto', overflowY: isMobile ? 'auto' : 'visible' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{editingEvent ? 'ویرایش رویداد' : 'رویداد جدید'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>×</button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>عنوان</label>
              <input 
                type="text" 
                value={eventForm.title} 
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                style={{ width: '100%', padding: '10px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', fontSize: '14px' }}
                placeholder="عنوان رویداد"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={eventForm.isAllDay} onChange={(e) => setEventForm({ ...eventForm, isAllDay: e.target.checked })} />
                رویداد تمام روز
              </label>
            </div>

            {!eventForm.isAllDay && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>زمان شروع</label>
                  <PersianTimePicker
                    value={eventForm.startTime}
                    onChange={(val) => setEventForm({ ...eventForm, startTime: val })}
                    theme={defaultTheme}
                    placeholder="زمان شروع"
                    defaultValue="09:00"
                    disabledHours={disabledHours}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>زمان پایان</label>
                  <PersianTimePicker
                    value={eventForm.endTime}
                    onChange={(val) => setEventForm({ ...eventForm, endTime: val })}
                    theme={defaultTheme}
                    placeholder="زمان پایان"
                    defaultValue="10:00"
                    disabledHours={disabledHours}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={eventForm.isMultiDay} onChange={(e) => setEventForm({ ...eventForm, isMultiDay: e.target.checked, isRecurring: e.target.checked ? false : eventForm.isRecurring })} />
                رویداد چند روزه
              </label>
            </div>

            {eventForm.isMultiDay && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>تاریخ پایان</label>
                <PersianDateTimePicker
                  value={eventForm.endDate}
                  onChange={(val) => setEventForm({ ...eventForm, endDate: val })}
                  showTime={false}
                  showFooter={false}
                  theme={defaultTheme}
                />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={eventForm.isRecurring} disabled={eventForm.isMultiDay} onChange={(e) => setEventForm({ ...eventForm, isRecurring: e.target.checked, isMultiDay: e.target.checked ? false : eventForm.isMultiDay })} />
                رویداد تکراری
              </label>
            </div>

            {eventForm.isRecurring && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>نوع تکرار</label>
                  <select 
                    value={eventForm.recurringType} 
                    onChange={(e) => setEventForm({ ...eventForm, recurringType: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', fontSize: '14px' }}
                  >
                    <option value="daily">روزانه</option>
                    <option value="weekly">هفتگی</option>
                    <option value="monthly">ماهانه</option>
                    <option value="yearly">سالانه</option>
                  </select>
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>پایان تکرار</label>
                  <PersianDateTimePicker
                    value={eventForm.recurringEnd}
                    onChange={(val) => setEventForm({ ...eventForm, recurringEnd: val })}
                    showTime={false}
                    showFooter={false}
                    theme={defaultTheme}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>رنگ</label>
              <input 
                type="color" 
                value={eventForm.color} 
                onChange={(e) => setEventForm({ ...eventForm, color: e.target.value })}
                style={{ width: '100%', height: '40px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>توضیحات</label>
              <textarea 
                value={eventForm.description} 
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                style={{ width: '100%', padding: '10px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
                placeholder="توضیحات رویداد"
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {editingEvent && (
                <button 
                  onClick={handleDeleteEvent}
                  style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#ff4d4f', color: '#fff', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ff7875'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ff4d4f'}
                >
                  حذف
                </button>
              )}
              <button 
                onClick={closeModal}
                style={{ padding: '10px 20px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: defaultTheme.backgroundColor, cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = defaultTheme.hoverColor}
                onMouseLeave={(e) => e.currentTarget.style.background = defaultTheme.backgroundColor}
              >
                لغو
              </button>
              <button 
                onClick={handleSaveEvent}
                style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: defaultTheme.primaryColor, color: '#fff', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}

      {showHolidayModal && selectedHoliday && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: holidayModalClosing ? 'fadeOut 0.2s' : 'fadeIn 0.2s', padding: isMobile ? '16px' : '0' }} onClick={closeHolidayModal}>
          <div style={{ background: defaultTheme.backgroundColor, borderRadius: isMobile ? '8px' : '12px', padding: isMobile ? '16px' : '24px', width: '100%', maxWidth: isMobile ? '100%' : '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', animation: holidayModalClosing ? 'slideOut 0.2s' : 'slideIn 0.3s', direction: 'rtl' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>تعطیلات رسمی</h3>
              <button onClick={closeHolidayModal} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>×</button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: defaultTheme.textColor, marginBottom: '8px' }}>{selectedHoliday.title}</div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>{selectedHoliday.date}</div>
            </div>

            {selectedHoliday.description && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', background: '#f9f9f9', padding: '12px', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
                  {selectedHoliday.description}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                onClick={closeHolidayModal}
                style={{ padding: '10px 24px', border: 'none', borderRadius: '6px', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianCalendar;
