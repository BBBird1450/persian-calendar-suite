import { useState, useEffect, useRef } from "react";

const PERSIAN_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const PERSIAN_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export default function PersianDateTimePicker({ 
  value, 
  onChange, 
  disabledHours = [], 
  showTime = true, 
  minuteStep = 1,
  theme = {},
  outputFormat = 'iso',
  showFooter = true
}) {
  const defaultTheme = {
    primaryColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderColor: '#d9d9d9',
    hoverColor: '#f0f0f0',
    selectedTextColor: '#ffffff',
    textColor: '#000000',
    todayColor: '#e6f7ff',
    circularDates: false,
    ...theme
  };
  
  const lightenColor = (color, percent = 80) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) + Math.round((255 - (num >> 16)) * percent / 100)));
    const g = Math.min(255, (((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * percent / 100)));
    const b = Math.min(255, ((num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * percent / 100)));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeStr, setTimeStr] = useState("00:00");
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayMonth, setDisplayMonth] = useState({ year: 1403, month: 9 });
  const [today, setToday] = useState(null);
  const [viewMode, setViewMode] = useState('day');
  const [yearPage, setYearPage] = useState(0);
  const wrapperRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const todayDate = new Date();
    const jToday = gregorianToJalali(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate());
    setToday({ year: jToday.jy, month: jToday.jm, day: jToday.jd });
    setDisplayMonth({ year: jToday.jy, month: jToday.jm });
  }, []);
  
  useEffect(() => {
    if (value) {
      let d;
      if (typeof value === 'number') {
        d = new Date(value);
      } else if (typeof value === 'string' && value.includes('T')) {
        d = new Date(value);
      } else {
        return;
      }
      const jDate = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
      setSelectedDay({ year: jDate.jy, month: jDate.jm, day: jDate.jd });
      setDisplayMonth({ year: jDate.jy, month: jDate.jm });
      setTimeStr(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsClosing(true);
        setTimeout(() => {
          setShowCalendar(false);
          setIsClosing(false);
        }, 200);
      }
    };
    const handleScroll = () => {
      if (showCalendar) {
        setIsClosing(true);
        setTimeout(() => {
          setShowCalendar(false);
          setIsClosing(false);
        }, 200);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showCalendar]);

  useEffect(() => {
    if (selectedDay && timeStr) {
      updateValue(selectedDay, timeStr);
    }
  }, [outputFormat]);

  const handleDateSelect = (day) => {
    const newDate = { year: displayMonth.year, month: displayMonth.month, day };
    setSelectedDay(newDate);
    updateValue(newDate, timeStr);
    if (!showFooter) {
      setIsClosing(true);
      setTimeout(() => {
        setShowCalendar(false);
        setIsClosing(false);
      }, 200);
    }
  };

  const handleOk = () => {
    if (selectedDay) {
      updateValue(selectedDay, timeStr);
    }
    setIsClosing(true);
    setTimeout(() => {
      setShowCalendar(false);
      setIsClosing(false);
      setViewMode('day');
    }, 200);
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowCalendar(false);
      setIsClosing(false);
    }, 200);
  };

  const handleTimeChange = (time, timeString) => {
    setTimeStr(timeString);
    if (selectedDay) {
      updateValue(selectedDay, timeString);
    } else if (today) {
      updateValue(today, timeString);
    }
  };

  const updateValue = (date, time, skipOnChange = false) => {
    if (!date || !time) return;
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return;
    const gDate = jalaliToGregorian(date.year, date.month, date.day);
    
    const jsDate = new Date(gDate.gy, gDate.gm - 1, gDate.gd, h, m);
    
    let output;
    switch(outputFormat) {
      case 'timestamp':
        output = jsDate.getTime();
        break;
      case 'shamsi':
        output = `${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        break;
      case 'gregorian':
        output = `${gDate.gy}/${String(gDate.gm).padStart(2, '0')}/${String(gDate.gd).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        break;
      case 'hijri':
        const hijri = gregorianToHijri(gDate.gy, gDate.gm, gDate.gd);
        output = `${hijri.year}/${String(hijri.month).padStart(2, '0')}/${String(hijri.day).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        break;
      default:
        output = `${gDate.gy}-${String(gDate.gm).padStart(2, '0')}-${String(gDate.gd).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    }
    
    if (!skipOnChange) onChange(output);
  };

  const getDaysInMonth = (year, month) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return isLeapJalaliYear(year) ? 30 : 29;
  };

  const isLeapJalaliYear = (year) => {
    const breaks = [1, 5, 9, 13, 17, 22, 26, 30];
    const gy = year + 621;
    const leap = -14;
    let jp = breaks[0];
    let jump = 0;
    for (let i = 1; i < breaks.length; i++) {
      const jm = breaks[i];
      jump = jm - jp;
      if (year < jm) break;
      jp = jm;
    }
    let n = year - jp;
    if (jump - n < 6) n = n - jump + (Math.floor((jump + 4) / 33) * 33);
    let leapJ = ((((n + 1) % 33) - 1) % 4);
    if (leapJ === -1) leapJ = 4;
    return leapJ === 0;
  };

  const getFirstDayOfMonth = (year, month) => {
    const gDate = jalaliToGregorian(year, month, 1);
    const d = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
    return (d.getDay() + 1) % 7;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(displayMonth.year, displayMonth.month);
    const firstDay = getFirstDayOfMonth(displayMonth.year, displayMonth.month);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ width: '32px', height: '32px' }} />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDay && selectedDay.year === displayMonth.year && 
                        selectedDay.month === displayMonth.month && selectedDay.day === day;
      const isToday = today && today.year === displayMonth.year && 
                      today.month === displayMonth.month && today.day === day;
      days.push(
        <div
          key={day}
          onClick={() => handleDateSelect(day)}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: defaultTheme.circularDates ? '50%' : '4px',
            border: `1px solid ${defaultTheme.borderColor}`,
            backgroundColor: isSelected ? defaultTheme.primaryColor : isToday ? lightenColor(defaultTheme.primaryColor, 80) : 'transparent',
            color: isSelected ? defaultTheme.selectedTextColor : defaultTheme.textColor,
            fontWeight: isSelected ? 'bold' : 'normal',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => !isSelected && (e.target.style.backgroundColor = defaultTheme.hoverColor)}
          onMouseLeave={(e) => !isSelected && (e.target.style.backgroundColor = isToday ? lightenColor(defaultTheme.primaryColor, 80) : 'transparent')}
        >
          {day}
        </div>
      );
    }
    
    return days;
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

  const renderMonthPicker = () => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '8px' }}>
        {PERSIAN_MONTHS.map((m, i) => (
          <div
            key={i}
            onClick={() => {
              setDisplayMonth({ ...displayMonth, month: i + 1 });
              setViewMode('day');
            }}
            style={{
              padding: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '4px',
              background: displayMonth.month === i + 1 ? defaultTheme.primaryColor : 'transparent',
              color: displayMonth.month === i + 1 ? defaultTheme.selectedTextColor : defaultTheme.textColor,
              fontWeight: displayMonth.month === i + 1 ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => displayMonth.month !== i + 1 && (e.target.style.background = defaultTheme.hoverColor)}
            onMouseLeave={(e) => displayMonth.month !== i + 1 && (e.target.style.background = 'transparent')}
          >
            {m}
          </div>
        ))}
      </div>
    );
  };

  const renderYearPicker = () => {
    const startYear = displayMonth.year - 4 + (yearPage * 12);
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', marginBottom: '8px' }}>
          <button onClick={() => setYearPage(yearPage - 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: defaultTheme.primaryColor }}>«</button>
          <span style={{ color: defaultTheme.textColor, fontWeight: 'bold' }}>{startYear} - {startYear + 11}</span>
          <button onClick={() => setYearPage(yearPage + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: defaultTheme.primaryColor }}>»</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '8px' }}>
          {years.map(y => (
            <div
              key={y}
              onClick={() => {
                setDisplayMonth({ ...displayMonth, year: y });
                setViewMode('day');
                setYearPage(0);
              }}
              style={{
                padding: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '4px',
                background: displayMonth.year === y ? defaultTheme.primaryColor : 'transparent',
                color: displayMonth.year === y ? defaultTheme.selectedTextColor : defaultTheme.textColor,
                fontWeight: displayMonth.year === y ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => displayMonth.year !== y && (e.target.style.background = defaultTheme.hoverColor)}
              onMouseLeave={(e) => displayMonth.year !== y && (e.target.style.background = 'transparent')}
            >
              {y}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const goToToday = () => {
    if (today) {
      setDisplayMonth({ year: today.year, month: today.month });
    }
  };

  const displayValue = selectedDay 
    ? `${selectedDay.year}/${String(selectedDay.month).padStart(2, '0')}/${String(selectedDay.day).padStart(2, '0')}${showTime ? ` ${timeStr}` : ''}`
    : '';

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <div style={{ flex: 1, position: 'relative' }} ref={wrapperRef}>
        <input
          value={displayValue}
          onClick={() => setShowCalendar(!showCalendar)}
          placeholder="تاریخ را انتخاب کنید"
          readOnly
          style={{ width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', direction: 'rtl' }}
        />
        {showCalendar && (
          <div
          ref={(el) => {
            if (el && wrapperRef.current) {
              const rect = wrapperRef.current.getBoundingClientRect();
              const spaceBelow = window.innerHeight - rect.bottom;
              const dropdownHeight = 400;
              if (spaceBelow >= dropdownHeight) {
                el.style.top = `${rect.bottom + 4}px`;
              } else {
                el.style.bottom = `${window.innerHeight - rect.top + 4}px`;
              }
              el.style.left = `${rect.left}px`;
            }
          }}
          style={{
            position: 'fixed',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            background: defaultTheme.backgroundColor,
            padding: '16px',
            width: showTime ? '420px' : '300px',
            maxWidth: 'calc(100vw - 32px)',
            display: 'flex',
            gap: '16px',
            animation: isClosing ? 'fadeOut 0.2s ease-in-out' : 'fadeIn 0.2s ease-in-out'
          }}>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
          `}</style>
            <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
              {viewMode === 'day' && <button onClick={() => changeMonth(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px 8px', color: defaultTheme.primaryColor }}>«</button>}
              {viewMode !== 'day' && <div style={{ width: '32px' }} />}
              <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'center' }}>
                <button onClick={() => setViewMode('month')} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: defaultTheme.textColor, fontWeight: 'bold', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.color = defaultTheme.primaryColor; e.target.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.target.style.color = defaultTheme.textColor; e.target.style.textDecoration = 'none'; }}>
                  {PERSIAN_MONTHS[displayMonth.month - 1]}
                </button>
                <button onClick={() => setViewMode('year')} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: defaultTheme.textColor, fontWeight: 'bold', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.color = defaultTheme.primaryColor; e.target.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.target.style.color = defaultTheme.textColor; e.target.style.textDecoration = 'none'; }}>
                  {displayMonth.year}
                </button>
              </div>
              {viewMode === 'day' && <button onClick={() => changeMonth(1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px 8px', color: defaultTheme.primaryColor }}>»</button>}
              {viewMode !== 'day' && <div style={{ width: '32px' }} />}
            </div>
            <div style={{ animation: 'slideIn 0.2s ease-in-out' }}>
            {viewMode === 'day' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                  {PERSIAN_WEEKDAYS.map(day => (
                    <div key={day} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', color: defaultTheme.textColor }}>
                      {day}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '12px' }}>
                  {renderCalendar()}
                </div>
              </>
            )}
            {viewMode === 'month' && <div style={{ animation: 'slideIn 0.2s ease-in-out' }}>{renderMonthPicker()}</div>}
            {viewMode === 'year' && <div style={{ animation: 'slideIn 0.2s ease-in-out' }}>{renderYearPicker()}</div>}
            </div>
            <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }`}</style>
            {showFooter && (
              <div style={{ borderTop: `1px solid ${defaultTheme.borderColor}`, paddingTop: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                  <button onClick={goToToday} style={{ padding: '4px 12px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '4px', background: defaultTheme.backgroundColor, cursor: 'pointer', fontSize: '12px', color: defaultTheme.textColor }}>امروز</button>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleCancel} style={{ padding: '4px 12px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '4px', background: defaultTheme.backgroundColor, cursor: 'pointer', fontSize: '12px', color: defaultTheme.textColor }}>لغو</button>
                    <button onClick={handleOk} style={{ padding: '4px 12px', border: 'none', borderRadius: '4px', background: defaultTheme.primaryColor, color: defaultTheme.selectedTextColor, cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>تایید</button>
                  </div>
                </div>
              </div>
            )}
            </div>
            {showTime && (
              <div style={{ borderLeft: `1px solid ${defaultTheme.borderColor}`, paddingLeft: '16px', display: 'flex', gap: '8px', minWidth: '120px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: defaultTheme.textColor, opacity: 0.6, textAlign: 'center', marginBottom: '8px' }}>دقیقه</div>
                  <div style={{ maxHeight: '250px', overflowY: 'auto', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '4px' }}>
                    {Array.from({ length: Math.floor(60 / minuteStep) }, (_, i) => i * minuteStep).map(m => (
                      <div
                        key={m}
                        onClick={() => {
                          const newTime = `${timeStr.split(':')[0]}:${String(m).padStart(2, '0')}`;
                          handleTimeChange(null, newTime);
                        }}
                        style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '14px', background: timeStr.split(':')[1] === String(m).padStart(2, '0') ? defaultTheme.primaryColor : defaultTheme.backgroundColor, color: timeStr.split(':')[1] === String(m).padStart(2, '0') ? defaultTheme.selectedTextColor : defaultTheme.textColor, textAlign: 'center' }}
                        onMouseEnter={(e) => timeStr.split(':')[1] !== String(m).padStart(2, '0') && (e.target.style.background = defaultTheme.hoverColor)}
                        onMouseLeave={(e) => timeStr.split(':')[1] !== String(m).padStart(2, '0') && (e.target.style.background = defaultTheme.backgroundColor)}
                      >
                        {String(m).padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: defaultTheme.textColor, opacity: 0.6, textAlign: 'center', marginBottom: '8px' }}>ساعت</div>
                  <div style={{ maxHeight: '250px', overflowY: 'auto', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '4px' }}>
                    {Array.from({ length: 24 }, (_, i) => i).filter(h => !disabledHours.includes(h)).map(h => (
                      <div
                        key={h}
                        onClick={() => {
                          const newTime = `${String(h).padStart(2, '0')}:${timeStr.split(':')[1] || '00'}`;
                          handleTimeChange(null, newTime);
                        }}
                        style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '14px', background: timeStr.split(':')[0] === String(h).padStart(2, '0') ? defaultTheme.primaryColor : defaultTheme.backgroundColor, color: timeStr.split(':')[0] === String(h).padStart(2, '0') ? defaultTheme.selectedTextColor : defaultTheme.textColor, textAlign: 'center' }}
                        onMouseEnter={(e) => timeStr.split(':')[0] !== String(h).padStart(2, '0') && (e.target.style.background = defaultTheme.hoverColor)}
                        onMouseLeave={(e) => timeStr.split(':')[0] !== String(h).padStart(2, '0') && (e.target.style.background = defaultTheme.backgroundColor)}
                      >
                        {String(h).padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

function gregorianToJalali(gy, gm, gd) {
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
}

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

function gregorianToHijri(gy, gm, gd) {
  const jd = Math.floor((1461 * (gy + 4800 + Math.floor((gm - 14) / 12))) / 4) +
    Math.floor((367 * (gm - 2 - 12 * Math.floor((gm - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((gy + 4900 + Math.floor((gm - 14) / 12)) / 100)) / 4) +
    gd - 32075;
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}
