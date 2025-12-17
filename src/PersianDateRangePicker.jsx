import React, { useState, useRef, useEffect } from 'react';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const toPersianDigits = (str) => str.toString().replace(/\d/g, (digit) => PERSIAN_DIGITS[parseInt(digit)]);

const PersianDateRangePicker = ({ 
  value, 
  onChange, 
  placeholder = ['تاریخ شروع', 'تاریخ پایان'], 
  disabled = false, 
  className = '',
  theme = {},
  outputFormat = 'iso',
  showFooter = true,
  persianNumbers = false,
  rtlCalendar = false
}) => {
  const defaultTheme = {
    primaryColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderColor: '#d9d9d9',
    hoverColor: '#f0f0f0',
    selectedTextColor: '#ffffff',
    textColor: '#000000',
    todayColor: '#e6f7ff',
    rangeColor: '#e6f7ff',
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
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(value?.[0] || null);
  const [endDate, setEndDate] = useState(value?.[1] || null);
  const [hoverDate, setHoverDate] = useState(null);
  const [leftMonth, setLeftMonth] = useState(null);
  const [leftYear, setLeftYear] = useState(null);
  const [rightMonth, setRightMonth] = useState(null);
  const [rightYear, setRightYear] = useState(null);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [leftViewMode, setLeftViewMode] = useState('day');
  const [rightViewMode, setRightViewMode] = useState('day');
  const [leftYearPage, setLeftYearPage] = useState(0);
  const [rightYearPage, setRightYearPage] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (value && Array.isArray(value) && value[0] && typeof value[0] === 'string' && value[0].includes('-')) {
      setStartDate(value[0]);
      setEndDate(value[1]);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const jalali = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    setLeftMonth(jalali.month);
    setLeftYear(jalali.year);
    
    let nextMonth = jalali.month + 1;
    let nextYear = jalali.year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }
    setRightMonth(nextMonth);
    setRightYear(nextYear);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsClosing(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsClosing(false);
        }, 200);
      }
    };
    const handleScroll = (e) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsClosing(true);
        setTimeout(() => {
          setIsOpen(false);
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
  }, [isOpen]);

  useEffect(() => {
    if (startDate && endDate) {
      const output = formatOutput(startDate, endDate);
      onChange?.(output);
    }
  }, [outputFormat]);

  useEffect(() => {
    if (startDate && endDate) {
      const output = formatOutput(startDate, endDate);
      onChange?.(output);
    }
  }, [outputFormat]);

  const gregorianToJalali = (gy, gm, gd) => {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const jy = gy <= 1600 ? 0 : 979;
    gy -= gy <= 1600 ? 621 : 1600;
    let days = (365 * gy) + (Math.floor((gy + 3) / 4)) - (Math.floor((gy + 99) / 100)) + (Math.floor((gy + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
    if (gm > 2 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) days++;
    let jy_final = jy + 33 * Math.floor(days / 12053);
    days %= 12053;
    jy_final += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy_final += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
    return { year: jy_final, month: jm, day: jd };
  };

  const jalaliToGregorian = (jy, jm, jd) => {
    const gy = jy <= 979 ? 621 : 1600;
    jy -= jy <= 979 ? 0 : 979;
    let days = (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + (jm < 7 ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    let gy_final = gy + 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) {
      gy_final += 100 * Math.floor(--days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }
    gy_final += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
      gy_final += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    const g_d_m = [0, 31, ((gy_final % 4 === 0 && gy_final % 100 !== 0) || (gy_final % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm = 0;
    for (let i = 0; i < 13; i++) {
      const v = g_d_m[i];
      if (days < v) break;
      days -= v;
      gm++;
    }
    return { year: gy_final, month: gm, day: days + 1 };
  };

  const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const weekDaysRTL = ['ج', 'پ', 'چ', 'س', 'د', 'ی', 'ش'];

  const getDaysInMonth = (year, month) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    const isLeap = ((year - 979) % 33) % 4 === 1;
    return isLeap ? 30 : 29;
  };

  const getFirstDayOfMonth = (year, month) => {
    const greg = jalaliToGregorian(year, month, 1);
    const date = new Date(greg.year, greg.month - 1, greg.day);
    return (date.getDay() + 1) % 7;
  };

  const handleDateClick = (year, month, day) => {
    const greg = jalaliToGregorian(year, month, day);
    const isoString = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}`;
    
    if (!startDate || (startDate && endDate)) {
      setStartDate(isoString);
      setEndDate(null);
    } else {
      const start = new Date(startDate);
      const end = new Date(isoString);
      if (end < start) {
        setStartDate(isoString);
        setEndDate(null);
      } else {
        setEndDate(isoString);
        if (!showFooter) {
          const output = formatOutput(startDate, isoString);
          onChange?.(output);
          setIsClosing(true);
          setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
            setLeftViewMode('day');
            setRightViewMode('day');
          }, 200);
        }
      }
    }
  };

  const formatOutput = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    switch(outputFormat) {
      case 'timestamp':
        return [startDate.getTime(), endDate.getTime()];
      case 'shamsi':
        const sStart = gregorianToJalali(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
        const sEnd = gregorianToJalali(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate());
        return [
          `${sStart.year}/${String(sStart.month).padStart(2, '0')}/${String(sStart.day).padStart(2, '0')}`,
          `${sEnd.year}/${String(sEnd.month).padStart(2, '0')}/${String(sEnd.day).padStart(2, '0')}`
        ];
      case 'gregorian':
        return [
          `${startDate.getFullYear()}/${String(startDate.getMonth() + 1).padStart(2, '0')}/${String(startDate.getDate()).padStart(2, '0')}`,
          `${endDate.getFullYear()}/${String(endDate.getMonth() + 1).padStart(2, '0')}/${String(endDate.getDate()).padStart(2, '0')}`
        ];
      case 'hijri':
        const hStart = gregorianToHijri(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
        const hEnd = gregorianToHijri(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate());
        return [
          `${hStart.year}/${String(hStart.month).padStart(2, '0')}/${String(hStart.day).padStart(2, '0')}`,
          `${hEnd.year}/${String(hEnd.month).padStart(2, '0')}/${String(hEnd.day).padStart(2, '0')}`
        ];
      default:
        return [start, end];
    }
  };

  const handleOk = () => {
    if (startDate && endDate) {
      const output = formatOutput(startDate, endDate);
      onChange?.(output);
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setLeftViewMode('day');
      setRightViewMode('day');
    }, 200);
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const jalali = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    return `${jalali.year}/${String(jalali.month).padStart(2, '0')}/${String(jalali.day).padStart(2, '0')}`;
  };

  const isDateInRange = (year, month, day) => {
    const greg = jalaliToGregorian(year, month, day);
    const current = new Date(greg.year, greg.month - 1, greg.day);
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : (hoverDate ? new Date(hoverDate) : null);
    
    if (!startDate || !end) return false;
    return current > start && current < end;
  };

  const isDateSelected = (year, month, day) => {
    const greg = jalaliToGregorian(year, month, day);
    const isoString = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}`;
    return isoString === startDate || isoString === endDate;
  };

  const isDateStart = (year, month, day) => {
    const greg = jalaliToGregorian(year, month, day);
    const isoString = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}`;
    return isoString === startDate;
  };

  const isDateEnd = (year, month, day) => {
    const greg = jalaliToGregorian(year, month, day);
    const isoString = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}`;
    return isoString === endDate || (!endDate && isoString === hoverDate);
  };

  const renderCalendar = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ width: '32px', height: '32px' }} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isDateSelected(year, month, day);
      const isInRange = isDateInRange(year, month, day);
      const isStart = isDateStart(year, month, day);
      const isEnd = isDateEnd(year, month, day);
      
      const isMobile = window.innerWidth <= 768;
      const dayStyle = {
        width: isMobile ? '30px' : '32px',
        height: isMobile ? '30px' : '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: `1px solid ${defaultTheme.borderColor}`,
        fontSize: isMobile ? '14px' : '14px',
        color: defaultTheme.textColor,
        transition: 'all 0.2s'
      };

      if (isStart || isEnd) {
        dayStyle.backgroundColor = defaultTheme.primaryColor;
        dayStyle.color = defaultTheme.selectedTextColor;
        dayStyle.fontWeight = 'bold';
        dayStyle.borderRadius = defaultTheme.circularDates ? '50%' : '4px';
      } else if (isInRange) {
        dayStyle.backgroundColor = lightenColor(defaultTheme.primaryColor, 80);
        dayStyle.borderRadius = defaultTheme.circularDates ? '50%' : '4px';
      } else {
        dayStyle.borderRadius = defaultTheme.circularDates ? '50%' : '4px';
      }

      days.push(
        <div
          className="range-day"
          key={day}
          style={dayStyle}
          onClick={() => handleDateClick(year, month, day)}
          onMouseEnter={(e) => {
            if (startDate && !endDate) {
              const greg = jalaliToGregorian(year, month, day);
              setHoverDate(`${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}`);
            }
            if (!isStart && !isEnd && !isInRange) {
              e.target.style.backgroundColor = defaultTheme.hoverColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!isStart && !isEnd && !isInRange) {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          {persianNumbers ? toPersianDigits(day) : day}
        </div>
      );
    }

    return days;
  };

  const renderMonthPicker = (month, setMonth, setViewMode) => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '8px', maxHeight: '300px', overflowY: 'auto' }}>
        {persianMonths.map((m, i) => (
          <div
            key={i}
            onClick={() => {
              setMonth(i + 1);
              setViewMode('day');
            }}
            style={{
              padding: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '4px',
              background: month === i + 1 ? defaultTheme.primaryColor : 'transparent',
              color: month === i + 1 ? defaultTheme.selectedTextColor : defaultTheme.textColor,
              fontWeight: month === i + 1 ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => month !== i + 1 && (e.target.style.background = defaultTheme.hoverColor)}
            onMouseLeave={(e) => month !== i + 1 && (e.target.style.background = 'transparent')}
          >
            {m}
          </div>
        ))}
      </div>
    );
  };

  const renderYearPicker = (year, setYear, yearPage, setYearPage, setViewMode) => {
    const startYear = year - 4 + (yearPage * 12);
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);
    return (
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                setYear(y);
                setViewMode('day');
                setYearPage(0);
              }}
              style={{
                padding: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '4px',
                background: year === y ? defaultTheme.primaryColor : 'transparent',
                color: year === y ? defaultTheme.selectedTextColor : defaultTheme.textColor,
                fontWeight: year === y ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => year !== y && (e.target.style.background = defaultTheme.hoverColor)}
              onMouseLeave={(e) => year !== y && (e.target.style.background = 'transparent')}
            >
              {y}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const changeLeftMonth = (delta) => {
    let newMonth = leftMonth + delta;
    let newYear = leftYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setLeftMonth(newMonth);
    setLeftYear(newYear);
  };

  const changeRightMonth = (delta) => {
    let newMonth = rightMonth + delta;
    let newYear = rightYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setRightMonth(newMonth);
    setRightYear(newYear);
  };

  const displayValue = startDate && endDate 
    ? `${persianNumbers ? toPersianDigits(formatDate(startDate)) : formatDate(startDate)} ~ ${persianNumbers ? toPersianDigits(formatDate(endDate)) : formatDate(endDate)}`
    : startDate
    ? (persianNumbers ? toPersianDigits(formatDate(startDate)) : formatDate(startDate))
    : '';

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }} className={className}>
      <input
        value={displayValue}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        placeholder={`${placeholder[0]} ~ ${placeholder[1]}`}
        readOnly
        disabled={disabled}
        style={{ width: '100%', padding: '4px 11px', border: '1px solid #d9d9d9', borderRadius: '6px', fontSize: '14px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, fontFamily: 'inherit', transition: 'all 0.2s', direction: 'rtl', boxSizing: 'border-box', lineHeight: '1.57' }}
      />

      {isOpen && (
        <div
          ref={dropdownRef}
          onMouseLeave={() => setHoverDate(null)}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            background: defaultTheme.backgroundColor,
            padding: window.innerWidth <= 768 ? '8px' : '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: window.innerWidth <= 768 ? '8px' : '16px',
            animation: isClosing ? 'fadeOut 0.2s ease-in-out' : 'fadeIn 0.2s ease-in-out',
            maxWidth: 'calc(100vw - 16px)',
            maxHeight: 'calc(100vh - 16px)',
            overflowY: 'auto'
          }}
          onScroll={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
            @keyframes fadeOut { from { opacity: 1; transform: translate(-50%, -50%) scale(1); } to { opacity: 0; transform: translate(-50%, -50%) scale(0.95); } }
            @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
            @media (max-width: 768px) {
              .range-calendars { flex-direction: column !important; }
              .range-calendar { min-width: 240px !important; max-width: 100% !important; }
              .range-day { width: 30px !important; height: 30px !important; font-size: 14px !important; }
              .range-weekday { width: 30px !important; height: 30px !important; font-size: 10px !important; }
            }
          `}</style>
          <div className="range-calendars" style={{ display: 'flex', gap: window.innerWidth <= 768 ? '8px' : '16px' }}>
            <div className="range-calendar" style={{ minWidth: window.innerWidth <= 768 ? '240px' : '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
                {leftViewMode === 'day' && <button onClick={() => changeLeftMonth(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px 8px', color: defaultTheme.primaryColor }}>«</button>}
                {leftViewMode !== 'day' && <div style={{ width: '32px' }} />}
                <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'center' }}>
                  <button onClick={() => setLeftViewMode('month')} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: defaultTheme.textColor, fontWeight: 'bold', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.color = defaultTheme.primaryColor; e.target.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.target.style.color = defaultTheme.textColor; e.target.style.textDecoration = 'none'; }}>
                    {persianMonths[leftMonth - 1]}
                  </button>
                  <button onClick={() => setLeftViewMode('year')} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: defaultTheme.textColor, fontWeight: 'bold', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.color = defaultTheme.primaryColor; e.target.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.target.style.color = defaultTheme.textColor; e.target.style.textDecoration = 'none'; }}>
                    {leftYear}
                  </button>
                </div>
                {leftViewMode === 'day' && <button onClick={() => changeLeftMonth(1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px 8px', color: defaultTheme.primaryColor }}>»</button>}
                {leftViewMode !== 'day' && <div style={{ width: '32px' }} />}
              </div>
              <div style={{ animation: 'slideIn 0.2s ease-in-out', maxHeight: '350px', overflowY: 'auto' }}>
              {leftViewMode === 'day' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                    {(rtlCalendar ? weekDaysRTL : weekDays).map(day => (
                      <div className="range-weekday" key={day} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', color: defaultTheme.textColor }}>
                        {day}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', direction: rtlCalendar ? 'rtl' : 'ltr' }}>
                    {renderCalendar(leftYear, leftMonth)}
                  </div>
                </>
              )}
              {leftViewMode === 'month' && <div style={{ animation: 'slideIn 0.2s ease-in-out' }}>{renderMonthPicker(leftMonth, setLeftMonth, setLeftViewMode)}</div>}
              {leftViewMode === 'year' && <div style={{ animation: 'slideIn 0.2s ease-in-out' }}>{renderYearPicker(leftYear, setLeftYear, leftYearPage, setLeftYearPage, setLeftViewMode)}</div>}
              </div>
            </div>

            <div className="range-calendar" style={{ minWidth: window.innerWidth <= 768 ? '240px' : '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
                {rightViewMode === 'day' && <button onClick={() => changeRightMonth(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px 8px', color: defaultTheme.primaryColor }}>«</button>}
                {rightViewMode !== 'day' && <div style={{ width: '32px' }} />}
                <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'center' }}>
                  <button onClick={() => setRightViewMode('month')} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: defaultTheme.textColor, fontWeight: 'bold', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.color = defaultTheme.primaryColor; e.target.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.target.style.color = defaultTheme.textColor; e.target.style.textDecoration = 'none'; }}>
                    {persianMonths[rightMonth - 1]}
                  </button>
                  <button onClick={() => setRightViewMode('year')} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: defaultTheme.textColor, fontWeight: 'bold', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.color = defaultTheme.primaryColor; e.target.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.target.style.color = defaultTheme.textColor; e.target.style.textDecoration = 'none'; }}>
                    {rightYear}
                  </button>
                </div>
                {rightViewMode === 'day' && <button onClick={() => changeRightMonth(1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px 8px', color: defaultTheme.primaryColor }}>»</button>}
                {rightViewMode !== 'day' && <div style={{ width: '32px' }} />}
              </div>
              <div style={{ animation: 'slideIn 0.2s ease-in-out', maxHeight: '350px', overflowY: 'auto' }}>
              {rightViewMode === 'day' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                    {(rtlCalendar ? weekDaysRTL : weekDays).map(day => (
                      <div className="range-weekday" key={day} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', color: defaultTheme.textColor }}>
                        {day}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', direction: rtlCalendar ? 'rtl' : 'ltr' }}>
                    {renderCalendar(rightYear, rightMonth)}
                  </div>
                </>
              )}
              {rightViewMode === 'month' && <div style={{ animation: 'slideIn 0.2s ease-in-out' }}>{renderMonthPicker(rightMonth, setRightMonth, setRightViewMode)}</div>}
              {rightViewMode === 'year' && <div style={{ animation: 'slideIn 0.2s ease-in-out' }}>{renderYearPicker(rightYear, setRightYear, rightYearPage, setRightYearPage, setRightViewMode)}</div>}
              </div>
            </div>
          </div>
          
          {showFooter && (
            <div style={{ borderTop: `1px solid ${defaultTheme.borderColor}`, paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={handleCancel} style={{ padding: '6px 16px', border: `1px solid ${defaultTheme.borderColor}`, borderRadius: '4px', background: defaultTheme.backgroundColor, cursor: 'pointer', fontSize: '14px', color: defaultTheme.textColor }}>لغو</button>
              <button onClick={handleOk} style={{ padding: '6px 16px', border: 'none', borderRadius: '4px', background: defaultTheme.primaryColor, color: defaultTheme.selectedTextColor, cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>تایید</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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

export default PersianDateRangePicker;
