import React from 'react';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const toPersianDigits = (str) => str.toString().replace(/\d/g, (digit) => PERSIAN_DIGITS[parseInt(digit)]);

const PersianTimeline = ({
  events = [],
  theme = {},
  persianNumbers = false,
  direction = 'vertical',
  markerShape = 'circular',
  showIcons = true,
  onEventClick,
  alternating = true
}) => {
  const defaultTheme = {
    primaryColor: theme.primaryColor || '#1890ff',
    backgroundColor: theme.backgroundColor || '#ffffff',
    borderColor: theme.borderColor || '#e8e8e8',
    textColor: theme.textColor || '#000000',
    lineColor: theme.lineColor || '#d9d9d9',
    markerSize: theme.markerSize || '32px',
    eventRadius: theme.eventRadius || '12px',
    shadow: theme.shadow || '0 2px 8px rgba(0,0,0,0.08)'
  };

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

  const formatPersianDate = (dateStr) => {
    const date = new Date(dateStr);
    const jalali = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const formatted = `${jalali.jy}/${String(jalali.jm).padStart(2, '0')}/${String(jalali.jd).padStart(2, '0')}`;
    return persianNumbers ? toPersianDigits(formatted) : formatted;
  };

  const getEventColor = (event, index) => {
    if (event.color) return event.color;
    const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return colors[index % colors.length];
  };

  const renderMarker = (event, index) => {
    const eventColor = getEventColor(event, index);
    const size = defaultTheme.markerSize;
    console.log('Marker size:', size, 'Theme:', defaultTheme);
    const markerStyle = {
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
      maxWidth: size,
      maxHeight: size,
      borderRadius: markerShape === 'circular' ? '50%' : '6px',
      backgroundColor: eventColor,
      border: `3px solid ${defaultTheme.backgroundColor}`,
      boxShadow: defaultTheme.shadow,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      color: '#fff',
      position: 'relative',
      zIndex: 2,
      flexShrink: 0,
      overflow: 'hidden'
    };

    if (event.image) {
      return (
        <div style={markerStyle}>
          <img 
            src={event.image} 
            alt={event.title}
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: markerShape === 'circular' ? '50%' : '4px',
              objectFit: 'cover'
            }}
          />
        </div>
      );
    }

    if (showIcons && event.icon) {
      return (
        <div style={markerStyle}>
          {typeof event.icon === 'string' ? (
            <span>{event.icon}</span>
          ) : (
            event.icon
          )}
        </div>
      );
    }

    return <div style={markerStyle} />;
  };

  const renderEvent = (event, index) => {
    const isLeft = alternating ? index % 2 === 0 : false;
    
    const isMobile = window.innerWidth <= 768;
    const eventStyle = {
      background: defaultTheme.backgroundColor,
      border: `1px solid ${defaultTheme.borderColor}`,
      borderRadius: defaultTheme.eventRadius || '12px',
      padding: isMobile ? '12px 16px' : '18px 22px',
      boxShadow: defaultTheme.shadow,
      cursor: onEventClick ? 'pointer' : 'default',
      transition: 'all 0.2s',
      maxWidth: isMobile ? '100%' : '320px',
      minWidth: isMobile ? '100%' : '220px',
      position: 'relative'
    };

    const eventColor = getEventColor(event, index);
    const dateStyle = {
      fontSize: isMobile ? '11px' : '12px',
      color: eventColor,
      fontWeight: 'bold',
      marginBottom: isMobile ? '6px' : '8px'
    };

    const titleStyle = {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: 'bold',
      color: defaultTheme.textColor,
      marginBottom: event.description ? (isMobile ? '6px' : '8px') : '0'
    };

    const descriptionStyle = {
      fontSize: isMobile ? '12px' : '14px',
      color: defaultTheme.textColor,
      opacity: 0.7,
      lineHeight: '1.4'
    };

    return (
      <div
        style={{
          ...eventStyle,
          borderLeft: `4px solid ${eventColor}`
        }}
        onClick={() => onEventClick?.(event)}
        onMouseEnter={(e) => {
          if (onEventClick) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
          }
        }}
        onMouseLeave={(e) => {
          if (onEventClick) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = defaultTheme.shadow;
          }
        }}
      >
        <div style={dateStyle}>
          {formatPersianDate(event.date)}
          {event.time && ` - ${persianNumbers ? toPersianDigits(event.time) : event.time}`}
        </div>
        <div style={titleStyle}>{event.title}</div>
        {event.description && (
          <div style={descriptionStyle}>{event.description}</div>
        )}
      </div>
    );
  };

  const isMobile = window.innerWidth <= 768;

  if (direction === 'horizontal') {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0', 
        padding: isMobile ? '12px' : '20px',
        overflowX: 'auto'
      }}>
        {events.map((event, index) => (
          <React.Fragment key={index}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: isMobile ? '10px' : '16px',
              minWidth: isMobile ? '160px' : '220px'
            }}>
              {renderEvent(event, index)}
              {renderMarker(event, index)}
            </div>
            {index < events.length - 1 && (
              <div style={{
                width: isMobile ? '24px' : '48px',
                height: '2px',
                backgroundColor: defaultTheme.lineColor,
                flexShrink: 0
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'relative', 
      padding: isMobile ? '12px' : '20px',
      direction: 'rtl'
    }}>
      <div style={{
        position: 'absolute',
        right: alternating && !isMobile ? '50%' : (isMobile ? '16px' : '24px'),
        top: '0',
        bottom: '0',
        width: '2px',
        backgroundColor: defaultTheme.lineColor,
        zIndex: 1
      }} />
      
      {events.map((event, index) => {
        const isLeft = alternating && !isMobile ? index % 2 === 0 : false;
        const useAlternating = alternating && !isMobile;
        
        return (
          <div key={index} style={{ 
            display: 'flex',
            alignItems: 'center',
            marginBottom: index < events.length - 1 ? (isMobile ? '20px' : '32px') : '0',
            flexDirection: useAlternating ? (isLeft ? 'row' : 'row-reverse') : 'row',
            gap: isMobile ? '10px' : '16px'
          }}>
            {useAlternating && (
              <div style={{ 
                flex: 1,
                display: 'flex',
                justifyContent: isLeft ? 'flex-end' : 'flex-start'
              }}>
                {isLeft && renderEvent(event, index)}
              </div>
            )}
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              {renderMarker(event, index)}
            </div>
            
            <div style={{ 
              flex: 1,
              display: 'flex',
              justifyContent: useAlternating ? (isLeft ? 'flex-start' : 'flex-end') : 'flex-start'
            }}>
              {useAlternating ? (!isLeft && renderEvent(event, index)) : renderEvent(event, index)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PersianTimeline;