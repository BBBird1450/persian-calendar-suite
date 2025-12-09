import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PersianDateTimePicker from '../src/PersianDateTimePicker.jsx';
import PersianDateRangePicker from '../src/PersianDateRangePicker.jsx';
import CalendarDemo from './CalendarDemo.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('datetime');
  const [globalTheme, setGlobalTheme] = useState({
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#e5e7eb',
    hoverColor: '#f3f4f6',
    selectedTextColor: '#ffffff',
    circularDates: false
  });
  
  const [dt1, setDt1] = useState(null);
  const [dt1Config, setDt1Config] = useState({ outputFormat: 'iso', showFooter: true, showTime: true });
  const [dt1Internal, setDt1Internal] = useState(null);
  
  const [range1, setRange1] = useState(null);
  const [range1Config, setRange1Config] = useState({ outputFormat: 'iso', showFooter: true });
  const [range1Internal, setRange1Internal] = useState(null);

  const tabs = [
    { id: 'datetime', label: 'DateTime Picker', icon: '' },
    { id: 'range', label: 'Range Picker', icon: '' },
    { id: 'calendar', label: 'Calendar', icon: '' }
  ];

  const presetColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const bgColors = ['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb', '#fef3c7', '#dbeafe'];
  const textColors = ['#000000', '#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af'];
  const borderColors = ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#cbd5e1', '#94a3b8'];
  const hoverColors = ['#f3f4f6', '#e5e7eb', '#dbeafe', '#fef3c7', '#fce7f3', '#e0e7ff'];

  const getCodeExample = () => {
    if (activeTab === 'datetime') {
      return `import { PersianDateTimePicker } from 'persian-calendar-suite';

function MyComponent() {
  const [date, setDate] = useState(null);

  return (
    <PersianDateTimePicker
      value={date}
      onChange={setDate}
      showTime={${dt1Config.showTime}}
      showFooter={${dt1Config.showFooter}}
      outputFormat="${dt1Config.outputFormat}"
      theme={{
        primaryColor: '${globalTheme.primaryColor}',
        backgroundColor: '${globalTheme.backgroundColor}',
        textColor: '${globalTheme.textColor}',
        borderColor: '${globalTheme.borderColor}',
        hoverColor: '${globalTheme.hoverColor}',
        selectedTextColor: '${globalTheme.selectedTextColor}',
        circularDates: ${globalTheme.circularDates}
      }}
    />
  );
}`;
    } else if (activeTab === 'range') {
      return `import { PersianDateRangePicker } from 'persian-calendar-suite';

function MyComponent() {
  const [range, setRange] = useState(null);

  return (
    <PersianDateRangePicker
      value={range}
      onChange={setRange}
      showFooter={${range1Config.showFooter}}
      outputFormat="${range1Config.outputFormat}"
      theme={{
        primaryColor: '${globalTheme.primaryColor}',
        backgroundColor: '${globalTheme.backgroundColor}',
        textColor: '${globalTheme.textColor}',
        borderColor: '${globalTheme.borderColor}',
        hoverColor: '${globalTheme.hoverColor}',
        selectedTextColor: '${globalTheme.selectedTextColor}',
        circularDates: ${globalTheme.circularDates}
      }}
    />
  );
}`;
    } else {
      return `import { PersianCalendar } from 'persian-calendar-suite';

function MyComponent() {
  const [events, setEvents] = useState([]);

  return (
    <PersianCalendar
      events={events}
      onEventCreate={(event) => setEvents([...events, event])}
      onEventUpdate={(updated) => 
        setEvents(events.map(e => e.id === updated.id ? updated : e))
      }
      onEventDelete={(deleted) => 
        setEvents(events.filter(e => e.id !== deleted.id))
      }
      initialView="day"
      editable={true}
      theme={{
        primaryColor: '${globalTheme.primaryColor}',
        backgroundColor: '${globalTheme.backgroundColor}',
        textColor: '${globalTheme.textColor}',
        borderColor: '${globalTheme.borderColor}',
        hoverColor: '${globalTheme.hoverColor}',
        circularDates: ${globalTheme.circularDates}
      }}
    />
  );
}`;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px', fontFamily: 'Vazir, system-ui, -apple-system, sans-serif', direction: 'ltr' }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css');
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        pre { margin: 0; }
        code { font-family: 'Consolas', 'Monaco', 'Courier New', monospace; }
        pre::-webkit-scrollbar { height: 8px; }
        pre::-webkit-scrollbar-track { background: #1e1e1e; }
        pre::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
        pre::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', color: 'white', animation: 'fadeIn 0.6s ease-out' }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 16px 0', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            Persian DatePicker React
          </h1>
          <p style={{ fontSize: '20px', margin: '0 0 16px 0', opacity: 0.9 }}>
            Comprehensive Jalali/Shamsi date picker components for React
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <code style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '14px' }}>
              npm install persian-calendar-suite
            </code>
            <a href="https://github.com/BBBird1450/persian-calendar-suite" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              Documentation
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 28px',
                border: 'none',
                borderRadius: '12px',
                background: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.2)',
                color: activeTab === tab.id ? '#6366f1' : 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                backdropFilter: 'blur(10px)',
                transform: activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Global Theme Settings */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', animation: 'slideIn 0.5s ease-out' }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px' }}>
             Theme Configuration
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Primary Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={globalTheme.primaryColor} 
                  onChange={(e) => setGlobalTheme({...globalTheme, primaryColor: e.target.value})} 
                  style={{ width: '60px', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }} 
                />
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setGlobalTheme({...globalTheme, primaryColor: color})}
                      style={{
                        width: '32px',
                        height: '32px',
                        border: globalTheme.primaryColor === color ? '3px solid #1f2937' : '2px solid #e5e7eb',
                        borderRadius: '6px',
                        background: color,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Background Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={globalTheme.backgroundColor} 
                  onChange={(e) => setGlobalTheme({...globalTheme, backgroundColor: e.target.value})} 
                  style={{ width: '60px', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }} 
                />
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {bgColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setGlobalTheme({...globalTheme, backgroundColor: color})}
                      style={{
                        width: '32px',
                        height: '32px',
                        border: globalTheme.backgroundColor === color ? '3px solid #1f2937' : '2px solid #e5e7eb',
                        borderRadius: '6px',
                        background: color,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Text Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={globalTheme.textColor} 
                  onChange={(e) => setGlobalTheme({...globalTheme, textColor: e.target.value})} 
                  style={{ width: '60px', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }} 
                />
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {textColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setGlobalTheme({...globalTheme, textColor: color})}
                      style={{
                        width: '32px',
                        height: '32px',
                        border: globalTheme.textColor === color ? '3px solid #1f2937' : '2px solid #e5e7eb',
                        borderRadius: '6px',
                        background: color,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Border Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={globalTheme.borderColor} 
                  onChange={(e) => setGlobalTheme({...globalTheme, borderColor: e.target.value})} 
                  style={{ width: '60px', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }} 
                />
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {borderColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setGlobalTheme({...globalTheme, borderColor: color})}
                      style={{
                        width: '32px',
                        height: '32px',
                        border: globalTheme.borderColor === color ? '3px solid #1f2937' : '2px solid #e5e7eb',
                        borderRadius: '6px',
                        background: color,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Hover Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={globalTheme.hoverColor} 
                  onChange={(e) => setGlobalTheme({...globalTheme, hoverColor: e.target.value})} 
                  style={{ width: '60px', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }} 
                />
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {hoverColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setGlobalTheme({...globalTheme, hoverColor: color})}
                      style={{
                        width: '32px',
                        height: '32px',
                        border: globalTheme.hoverColor === color ? '3px solid #1f2937' : '2px solid #e5e7eb',
                        borderRadius: '6px',
                        background: color,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Date Shape</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setGlobalTheme({...globalTheme, circularDates: false})}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: globalTheme.circularDates ? '2px solid #e5e7eb' : '2px solid #6366f1',
                    borderRadius: '8px',
                    background: globalTheme.circularDates ? 'white' : '#6366f1',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={globalTheme.circularDates ? '#6b7280' : 'white'} strokeWidth="2">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </button>
                <button
                  onClick={() => setGlobalTheme({...globalTheme, circularDates: true})}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: globalTheme.circularDates ? '2px solid #6366f1' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    background: globalTheme.circularDates ? '#6366f1' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={globalTheme.circularDates ? 'white' : '#6b7280'} strokeWidth="2">
                    <circle cx="12" cy="12" r="6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DateTime Picker Tab */}
        {activeTab === 'datetime' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', animation: 'slideIn 0.5s ease-out' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
               DateTime Picker
            </h2>
            <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>
              Single date and time selection with multiple output formats
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px', padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                <input type="checkbox" checked={dt1Config.showTime} onChange={(e) => setDt1Config({...dt1Config, showTime: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                Show Time
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                <input type="checkbox" checked={dt1Config.showFooter} onChange={(e) => setDt1Config({...dt1Config, showFooter: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                Show Footer
              </label>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Output Format</label>
                <select 
                  value={dt1Config.outputFormat} 
                  onChange={(e) => setDt1Config({...dt1Config, outputFormat: e.target.value})} 
                  style={{ width: '100%', padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: 'white' }}
                >
                  <option value="iso">ISO 8601</option>
                  <option value="shamsi">Shamsi</option>
                  <option value="gregorian">Gregorian</option>
                  <option value="hijri">Hijri</option>
                  <option value="timestamp">Timestamp</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Interactive Demo</label>
              <PersianDateTimePicker
                value={dt1Internal}
                onChange={(val) => {
                  setDt1Internal(val);
                  setDt1(val);
                }}
                theme={globalTheme}
                outputFormat={dt1Config.outputFormat}
                showTime={dt1Config.showTime}
                showFooter={dt1Config.showFooter}
              />
            </div>

            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Output Value:</div>
              <div style={{ fontSize: '15px', fontFamily: 'monospace', color: '#1f2937', wordBreak: 'break-all' }}>
                {dt1 ? (() => {
                  const date = new Date(dt1);
                  if (dt1Config.outputFormat === 'timestamp') return date.getTime();
                  return dt1;
                })() : <span style={{ color: '#9ca3af' }}>No date selected</span>}
              </div>
            </div>

            <div style={{ position: 'relative', padding: '16px', background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#4ec9b0' }}>Code Example</div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getCodeExample());
                    const btn = event.target;
                    btn.textContent = '✓ Copied!';
                    setTimeout(() => btn.textContent = ' Copy', 2000);
                  }}
                  style={{
                    padding: '6px 12px',
                    background: '#2d2d2d',
                    color: '#d4d4d4',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#3e3e3e'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#2d2d2d'}
                >
                   Copy
                </button>
              </div>
              <pre style={{ margin: 0, color: '#d4d4d4', fontSize: '13px', lineHeight: '1.6', overflowX: 'auto', fontFamily: '"Consolas", "Monaco", "Courier New", monospace' }}>
                <code>{getCodeExample()}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Range Picker Tab */}
        {activeTab === 'range' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', animation: 'slideIn 0.5s ease-out' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
               Range Picker
            </h2>
            <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>
              Select date ranges with dual calendar view
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px', padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                <input type="checkbox" checked={range1Config.showFooter} onChange={(e) => setRange1Config({...range1Config, showFooter: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                Show Footer
              </label>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Output Format</label>
                <select 
                  value={range1Config.outputFormat} 
                  onChange={(e) => setRange1Config({...range1Config, outputFormat: e.target.value})} 
                  style={{ width: '100%', padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: 'white' }}
                >
                  <option value="iso">ISO 8601</option>
                  <option value="shamsi">Shamsi</option>
                  <option value="gregorian">Gregorian</option>
                  <option value="hijri">Hijri</option>
                  <option value="timestamp">Timestamp</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Interactive Demo</label>
              <PersianDateRangePicker
                value={range1Internal}
                onChange={(val) => {
                  setRange1Internal(val);
                  setRange1(val);
                }}
                theme={globalTheme}
                outputFormat={range1Config.outputFormat}
                showFooter={range1Config.showFooter}
              />
            </div>

            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Output Value:</div>
              <div style={{ fontSize: '15px', fontFamily: 'monospace', color: '#1f2937', wordBreak: 'break-all' }}>
                {range1 ? (() => {
                  if (range1Config.outputFormat === 'timestamp') {
                    return JSON.stringify([new Date(range1[0]).getTime(), new Date(range1[1]).getTime()], null, 2);
                  }
                  return JSON.stringify(range1, null, 2);
                })() : <span style={{ color: '#9ca3af' }}>No range selected</span>}
              </div>
            </div>

            <div style={{ position: 'relative', padding: '16px', background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#4ec9b0' }}>Code Example</div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getCodeExample());
                    const btn = event.target;
                    btn.textContent = '✓ Copied!';
                    setTimeout(() => btn.textContent = ' Copy', 2000);
                  }}
                  style={{
                    padding: '6px 12px',
                    background: '#2d2d2d',
                    color: '#d4d4d4',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#3e3e3e'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#2d2d2d'}
                >
                   Copy
                </button>
              </div>
              <pre style={{ margin: 0, color: '#d4d4d4', fontSize: '13px', lineHeight: '1.6', overflowX: 'auto', fontFamily: '"Consolas", "Monaco", "Courier New", monospace' }}>
                <code>{getCodeExample()}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', animation: 'slideIn 0.5s ease-out' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              Full Calendar
            </h2>
            <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>
              Complete calendar with event management, day/week/month views, and overlap detection
            </p>
            <CalendarDemo theme={globalTheme} codeExample={getCodeExample()} />
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '40px', textAlign: 'center', color: 'white', opacity: 0.9 }}>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '12px' }}>
            <a href="https://github.com/BBBird1450/persian-calendar-suite" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/persian-calendar-suite" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              NPM
            </a>
            <a href="https://github.com/BBBird1450/persian-calendar-suite#readme" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              Documentation
            </a>
          </div>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Made with ❤️ for the Persian community | MIT License
          </p>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
