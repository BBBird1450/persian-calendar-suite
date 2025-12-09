import { useState, useEffect } from 'react';

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
  editable = true
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
  const [displayMonth, setDisplayMonth] = useState({ year: 1403, month: 9 });
  const [currentDay, setCurrentDay] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(0);

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', startTime: '', endTime: '', color: defaultTheme.primaryColor, description: '' });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  const weekDaysShort = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const displayWeekDays = headerFormat === 'short' ? weekDaysShort : weekDays;
  const filteredWeekDays = showWeekends ? displayWeekDays : displayWeekDays.slice(0, 5);
  const gridCols = showWeekends ? 7 : 5;

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
    return events.filter(e => e.date?.startsWith(dateStr));
  };

  const handleSlotClick = (year, month, day, hour) => {
    if (!editable) return;
    const greg = jalaliToGregorian(year, month, day);
    const dateStr = `${greg.gy}-${String(greg.gm).padStart(2, '0')}-${String(greg.gd).padStart(2, '0')}`;
    setSelectedSlot({ date: dateStr, hour, year, month, day });
    setEventForm({ title: '', startTime: `${String(hour).padStart(2, '0')}:00`, endTime: `${String(hour + 1).padStart(2, '0')}:00`, color: defaultTheme.primaryColor, description: '' });
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (event, e) => {
    e?.stopPropagation();
    if (event.isHoliday) {
      onEventClick?.(event);
      return;
    }
    if (!editable) {
      onEventClick?.(event);
      return;
    }
    setEditingEvent(event);
    setEventForm({ 
      title: event.title, 
      startTime: event.startTime || event.time || '00:00', 
      endTime: event.endTime || '01:00', 
      color: event.color || defaultTheme.primaryColor, 
      description: event.description || '' 
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
    
    setShowEventModal(false);
    setEventForm({ title: '', startTime: '', endTime: '', color: defaultTheme.primaryColor, description: '' });
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      onEventDelete?.(editingEvent);
      setShowEventModal(false);
      setEditingEvent(null);
    }
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
      return `${currentDay} ${persianMonths[displayMonth.month - 1]} ${displayMonth.year}`;
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
      days.push(<div key={`empty-${i}`} style={{ minHeight: '100px', border: `1px solid ${defaultTheme.borderColor}`, background: '#fafafa', transition: 'all 0.2s' }} />);
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
        <div key={day} style={{ minHeight: '100px', border: `1px solid ${defaultTheme.borderColor}`, padding: '8px', background: isHoliday ? '#fff1f0' : isToday ? `${defaultTheme.primaryColor}08` : defaultTheme.backgroundColor, overflow: 'hidden', transition: 'all 0.2s', cursor: editable ? 'pointer' : 'default' }} onMouseEnter={(e) => e.currentTarget.style.background = `${defaultTheme.primaryColor}15`} onMouseLeave={(e) => e.currentTarget.style.background = isHoliday ? '#fff1f0' : isToday ? `${defaultTheme.primaryColor}08` : defaultTheme.backgroundColor} onClick={(e) => { if (e.target === e.currentTarget) handleSlotClick(displayMonth.year, displayMonth.month, day, 9); }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: isHoliday ? '#f5222d' : isToday ? defaultTheme.primaryColor : defaultTheme.textColor, fontSize: '14px' }}>{day}</div>
          {dayEvents.map((event, i) => (
            <div
              key={i}
              onClick={(e) => handleEventClick(event, e)}
              style={{
                background: event.color || defaultTheme.primaryColor,
                color: '#fff',
                padding: '4px 6px',
                marginBottom: '4px',
                borderRadius: defaultTheme.eventRadius,
                fontSize: '11px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
              {event.time && `${event.time} `}{event.title}
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
              <div key={day} style={{ padding: '8px', textAlign: 'center', background: defaultTheme.headerBg, borderLeft: `1px solid ${defaultTheme.borderColor}` }}>
                <div style={{ fontWeight: 'bold' }}>{filteredWeekDays[dayOfWeek]}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{day}</div>
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
                        style={{
                          background: event.color || defaultTheme.primaryColor,
                          color: '#fff',
                          padding: '6px',
                          marginBottom: '2px',
                          borderRadius: defaultTheme.eventRadius,
                          fontSize: '11px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
                        {event.title}
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

          return (
            <div key={hour} style={{ display: 'flex', borderBottom: `1px solid ${defaultTheme.borderColor}`, minHeight: '80px', background: hasOverlap ? '#fff7e6' : 'transparent' }}>
              <div style={{ width: '80px', padding: '8px', fontSize: '14px', color: '#999', textAlign: 'right', borderLeft: `1px solid ${defaultTheme.borderColor}`, background: defaultTheme.headerBg }}>
                {String(hour).padStart(2, '0')}:00
              </div>
              <div 
                style={{ flex: 1, padding: '4px', cursor: editable ? 'pointer' : 'default', position: 'relative' }}
                onClick={() => handleSlotClick(displayMonth.year, displayMonth.month, currentDay, hour)}
              >
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
                      style={{
                        background: event.color || defaultTheme.primaryColor,
                        color: '#fff',
                        padding: '12px',
                        borderRadius: defaultTheme.eventRadius,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: defaultTheme.shadow,
                        flex: hasOverlap ? `0 0 calc(${100 / overlappingEvents.length}% - 4px)` : '1',
                        minWidth: hasOverlap ? '120px' : 'auto',
                        border: event.isHoliday ? 'none' : '2px solid rgba(255,255,255,0.3)'
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
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{event.startTime || event.time} - {event.endTime || ''}</div>
                      <div style={{ marginTop: '4px' }}>{event.title}</div>
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

  return (
    <div style={{ background: defaultTheme.backgroundColor, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${defaultTheme.borderColor}`, boxShadow: defaultTheme.shadow, position: 'relative' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: defaultTheme.headerBg, borderBottom: `2px solid ${defaultTheme.borderColor}` }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handleNavigation(-1)} style={{ padding: '8px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: defaultTheme.backgroundColor, cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500' }} onMouseEnter={(e) => e.currentTarget.style.background = defaultTheme.primaryColor + '15'} onMouseLeave={(e) => e.currentTarget.style.background = defaultTheme.backgroundColor}>قبلی</button>
          <button onClick={() => handleNavigation(1)} style={{ padding: '8px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: defaultTheme.backgroundColor, cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500' }} onMouseEnter={(e) => e.currentTarget.style.background = defaultTheme.primaryColor + '15'} onMouseLeave={(e) => e.currentTarget.style.background = defaultTheme.backgroundColor}>بعدی</button>
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '20px', color: defaultTheme.textColor }}>
          {getNavigationText()}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setViewMode('day')} style={{ padding: '8px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: viewMode === 'day' ? defaultTheme.primaryColor : defaultTheme.backgroundColor, color: viewMode === 'day' ? '#fff' : defaultTheme.textColor, cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500' }}>روز</button>
          <button onClick={() => setViewMode('week')} style={{ padding: '8px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: viewMode === 'week' ? defaultTheme.primaryColor : defaultTheme.backgroundColor, color: viewMode === 'week' ? '#fff' : defaultTheme.textColor, cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500' }}>هفته</button>
          <button onClick={() => setViewMode('month')} style={{ padding: '8px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', background: viewMode === 'month' ? defaultTheme.primaryColor : defaultTheme.backgroundColor, color: viewMode === 'month' ? '#fff' : defaultTheme.textColor, cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500' }}>ماه</button>
        </div>
      </div>

      {viewMode === 'month' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, background: defaultTheme.headerBg, borderBottom: `2px solid ${defaultTheme.borderColor}` }}>
            {filteredWeekDays.map((day, i) => (
              <div key={i} style={{ padding: '12px', textAlign: 'center', fontWeight: '600', borderLeft: i > 0 ? `1px solid ${defaultTheme.borderColor}` : 'none', fontSize: '14px' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s' }} onClick={() => setShowEventModal(false)}>
          <div style={{ background: defaultTheme.backgroundColor, borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', animation: 'slideIn 0.3s', direction: 'rtl' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold' }}>{editingEvent ? 'ویرایش رویداد' : 'رویداد جدید'}</h3>
            
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>زمان شروع</label>
                <input 
                  type="time" 
                  value={eventForm.startTime} 
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>زمان پایان</label>
                <input 
                  type="time" 
                  value={eventForm.endTime} 
                  onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '6px', fontSize: '14px' }}
                />
              </div>
            </div>

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
                onClick={() => setShowEventModal(false)}
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
    </div>
  );
};

export default PersianCalendar;
