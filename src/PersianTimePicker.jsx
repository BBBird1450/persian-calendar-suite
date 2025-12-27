import React, { useState, useRef, useEffect } from 'react';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const toPersianDigits = (str) => str.toString().replace(/\d/g, (digit) => PERSIAN_DIGITS[parseInt(digit)]);

const PersianTimePicker = ({ 
  value = '', 
  onChange, 
  theme = {},
  minuteStep = 1,
  disabledHours = [],
  placeholder = 'انتخاب زمان',
  defaultValue = null,
  persianNumbers = false,
  isRange = false
}) => {
  const defaultTheme = {
    primaryColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderColor: '#e8e8e8',
    textColor: '#000000',
    hoverColor: '#f0f0f0',
    ...theme
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);
  
  const getInitialTime = () => {
    if (isRange && Array.isArray(value) && value[0]) {
      return {
        startHour: parseInt(value[0].split(':')[0]),
        startMinute: parseInt(value[0].split(':')[1]),
        endHour: value[1] ? parseInt(value[1].split(':')[0]) : 0,
        endMinute: value[1] ? parseInt(value[1].split(':')[1]) : 0
      };
    }
    if (value && !isRange) return { hour: parseInt(value.split(':')[0]), minute: parseInt(value.split(':')[1]) };
    if (defaultValue === 'now') {
      const now = new Date();
      return { hour: now.getHours(), minute: now.getMinutes() };
    }
    if (defaultValue && defaultValue.includes(':')) {
      return { hour: parseInt(defaultValue.split(':')[0]), minute: parseInt(defaultValue.split(':')[1]) };
    }
    return { hour: 0, minute: 0 };
  };
  
  const initialTime = getInitialTime();
  const [selectedHour, setSelectedHour] = useState(initialTime.hour || 0);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.minute || 0);
  const [startHour, setStartHour] = useState(initialTime.startHour || 0);
  const [startMinute, setStartMinute] = useState(initialTime.startMinute || 0);
  const [endHour, setEndHour] = useState(initialTime.endHour || 0);
  const [endMinute, setEndMinute] = useState(initialTime.endMinute || 0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = (e) => {
      if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [showDropdown]);

  const hours = Array.from({ length: 24 }, (_, i) => i).filter(h => !disabledHours.includes(h));
  const minutes = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);

  const handleTimeSelect = (hour, minute) => {
    if (isRange) {
      if (selectingStart) {
        setStartHour(hour);
        setStartMinute(minute);
        setSelectingStart(false);
      } else {
        setEndHour(hour);
        setEndMinute(minute);
        const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
        const endTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        onChange?.([startTime, endTime]);
        setShowDropdown(false);
        setSelectingStart(true);
      }
    } else {
      setSelectedHour(hour);
      setSelectedMinute(minute);
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      onChange?.(timeStr);
      setShowDropdown(false);
    }
  };

  const displayValue = isRange && Array.isArray(value) && value[0] 
    ? `${value[0]} ~ ${value[1] || ''}`
    : value || '';

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <input
        type="text"
        value={displayValue}
        placeholder={isRange ? 'از ~ تا' : placeholder}
        readOnly={isRange}
        onChange={(e) => {
          if (isRange) return;
          const val = e.target.value;
          if (/^\d{0,2}:?\d{0,2}$/.test(val)) {
            if (val.includes(':') && val.length === 5) {
              const [h, m] = val.split(':');
              if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                setSelectedHour(parseInt(h));
                setSelectedMinute(parseInt(m));
                onChange?.(val);
              }
            } else {
              onChange?.(val);
            }
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && displayValue.includes(':')) {
            setShowDropdown(false);
          }
        }}
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          boxSizing: 'border-box',
          margin: 0,
          padding: '4px 11px',
          color: 'rgba(0, 0, 0, 0.88)',
          fontSize: 'inherit',
          lineHeight: 1.57,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'transparent',
          border: `1px solid ${showDropdown ? defaultTheme.primaryColor : defaultTheme.borderColor}`,
          borderRadius: '6px',
          outline: 0,
          transition: 'all 0.2s linear',
          cursor: 'text',
          direction: 'ltr'
        }}
      />

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: defaultTheme.backgroundColor,
          border: `2px solid ${defaultTheme.primaryColor}`,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          marginTop: '4px',
          maxHeight: '200px',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', height: '200px' }}>
            {isRange ? (
              <>
                <div style={{ flex: 1, overflowY: 'auto', borderRight: `1px solid ${defaultTheme.borderColor}` }}>
                  <div style={{ padding: '4px', background: '#f5f5f5', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>از - ساعت</div>
                  {hours.map(hour => (
                    <div
                      key={hour}
                      onClick={() => { setStartHour(hour); }}
                      style={{
                        padding: '4px 8px',
                        cursor: 'pointer',
                        background: startHour === hour ? defaultTheme.primaryColor : 'transparent',
                        color: startHour === hour ? '#fff' : defaultTheme.textColor,
                        textAlign: 'center',
                        fontSize: '12px'
                      }}
                    >
                      {persianNumbers ? toPersianDigits(String(hour).padStart(2, '0')) : String(hour).padStart(2, '0')}
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', borderRight: `1px solid ${defaultTheme.borderColor}` }}>
                  <div style={{ padding: '4px', background: '#f5f5f5', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>از - دقیقه</div>
                  {minutes.map(minute => (
                    <div
                      key={minute}
                      onClick={() => { setStartMinute(minute); }}
                      style={{
                        padding: '4px 8px',
                        cursor: 'pointer',
                        background: startMinute === minute ? defaultTheme.primaryColor : 'transparent',
                        color: startMinute === minute ? '#fff' : defaultTheme.textColor,
                        textAlign: 'center',
                        fontSize: '12px'
                      }}
                    >
                      {persianNumbers ? toPersianDigits(String(minute).padStart(2, '0')) : String(minute).padStart(2, '0')}
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', borderRight: `1px solid ${defaultTheme.borderColor}` }}>
                  <div style={{ padding: '4px', background: '#f5f5f5', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>تا - ساعت</div>
                  {hours.map(hour => (
                    <div
                      key={hour}
                      onClick={() => { setEndHour(hour); }}
                      style={{
                        padding: '4px 8px',
                        cursor: 'pointer',
                        background: endHour === hour ? defaultTheme.primaryColor : 'transparent',
                        color: endHour === hour ? '#fff' : defaultTheme.textColor,
                        textAlign: 'center',
                        fontSize: '12px'
                      }}
                    >
                      {persianNumbers ? toPersianDigits(String(hour).padStart(2, '0')) : String(hour).padStart(2, '0')}
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div style={{ padding: '4px', background: '#f5f5f5', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>تا - دقیقه</div>
                  {minutes.map(minute => (
                    <div
                      key={minute}
                      onClick={() => {
                        setEndMinute(minute);
                        const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
                        const endTime = `${String(endHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                        onChange?.([startTime, endTime]);
                        setShowDropdown(false);
                      }}
                      style={{
                        padding: '4px 8px',
                        cursor: 'pointer',
                        background: endMinute === minute ? defaultTheme.primaryColor : 'transparent',
                        color: endMinute === minute ? '#fff' : defaultTheme.textColor,
                        textAlign: 'center',
                        fontSize: '12px'
                      }}
                    >
                      {persianNumbers ? toPersianDigits(String(minute).padStart(2, '0')) : String(minute).padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: 'auto', borderRight: `1px solid ${defaultTheme.borderColor}` }}>
                  <div style={{ padding: '4px', background: '#f5f5f5', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>ساعت</span>
                    <button onClick={() => {
                      const now = new Date();
                      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                      setSelectedHour(now.getHours());
                      setSelectedMinute(now.getMinutes());
                      onChange?.(currentTime);
                      setShowDropdown(false);
                    }} style={{ padding: '2px 6px', fontSize: '9px', border: 'none', background: defaultTheme.primaryColor, color: '#fff', borderRadius: '3px', cursor: 'pointer' }}>الان</button>
                  </div>
                  {hours.map(hour => (
                    <div
                      key={hour}
                      onClick={() => handleTimeSelect(hour, selectedMinute)}
                      style={{
                        padding: '4px 8px',
                        cursor: 'pointer',
                        background: selectedHour === hour ? defaultTheme.primaryColor : 'transparent',
                        color: selectedHour === hour ? '#fff' : defaultTheme.textColor,
                        textAlign: 'center',
                        fontSize: '12px'
                      }}
                    >
                      {persianNumbers ? toPersianDigits(String(hour).padStart(2, '0')) : String(hour).padStart(2, '0')}
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div style={{ padding: '4px', background: '#f5f5f5', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>دقیقه</div>
                  {minutes.map(minute => (
                    <div
                      key={minute}
                      onClick={() => handleTimeSelect(selectedHour, minute)}
                      style={{
                        padding: '4px 8px',
                        cursor: 'pointer',
                        background: selectedMinute === minute ? defaultTheme.primaryColor : 'transparent',
                        color: selectedMinute === minute ? '#fff' : defaultTheme.textColor,
                        textAlign: 'center',
                        fontSize: '12px'
                      }}
                    >
                      {persianNumbers ? toPersianDigits(String(minute).padStart(2, '0')) : String(minute).padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianTimePicker;