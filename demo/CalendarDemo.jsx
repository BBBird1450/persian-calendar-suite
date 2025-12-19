import React, { useState } from 'react';
import PersianCalendar from '../src/PersianCalendar.jsx';

function CalendarDemo({ theme, codeExample }) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 5);
  const dayAfterStr = `${dayAfter.getFullYear()}-${String(dayAfter.getMonth() + 1).padStart(2, '0')}-${String(dayAfter.getDate()).padStart(2, '0')}`;

  const [events, setEvents] = useState([
    { id: 1, date: todayStr, startTime: '09:00', endTime: '10:00', title: 'جلسه تیم', color: '#10b981', description: 'جلسه هفتگی تیم' },
    { id: 2, date: todayStr, startTime: '09:30', endTime: '10:30', title: 'بررسی کد', color: '#6366f1', description: 'بررسی کد پروژه' },
    { id: 3, date: todayStr, startTime: '14:00', endTime: '15:00', title: 'ارائه پروژه', color: '#f59e0b' },
    { id: 4, date: tomorrowStr, startTime: '10:30', endTime: '11:30', title: 'مصاحبه', color: '#8b5cf6' },
    { id: 5, date: dayAfterStr, startTime: '16:00', endTime: '17:00', title: 'ددلاین پروژه', color: '#ef4444' }
  ]);

  const [calendarConfig, setCalendarConfig] = useState({
    initialView: 'day',
    editable: true,
    headerFormat: 'full',
    disabledHours: [],
    showHolidays: true,
    rtlCalendar: true,
    persianNumbers: true
  });

  const [eventLog, setEventLog] = useState([]);
  const [callbackLog, setCallbackLog] = useState([]);

  const logCallback = (type, data) => {
    setCallbackLog(prev => [{
      type,
      data,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    }, ...prev].slice(0, 5));
  };

  const logAction = (action, event) => {
    const timestamp = new Date().toLocaleTimeString('fa-IR');
    setEventLog(prev => [{
      action,
      event: event.title,
      time: timestamp,
      id: Date.now()
    }, ...prev].slice(0, 10));
  };

  return (
    <>
      {/* Programmatic Control */}
      <div style={{ marginBottom: '24px', padding: '20px', background: 'linear-gradient(135deg, #10b98115 0%, #3b82f615 100%)', borderRadius: '12px', border: '2px solid #10b98130' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#10b981' }}> Programmatic Control</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Add Events:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => {
                const newEvent = {
                  id: Date.now(),
                  date: todayStr,
                  startTime: '11:00',
                  endTime: '12:00',
                  title: 'Quick Meeting',
                  color: '#3b82f6'
                };
                setEvents([...events, newEvent]);
              }} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                + Add Today
              </button>
              <button onClick={() => {
                const newEvent = {
                  id: Date.now(),
                  date: tomorrowStr,
                  startTime: '15:00',
                  endTime: '16:00',
                  title: 'Follow-up',
                  color: '#8b5cf6'
                };
                setEvents([...events, newEvent]);
              }} style={{ padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                + Add Tomorrow
              </button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Bulk Operations:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => {
                setEvents(events.map(e => ({ ...e, color: '#ef4444' })));
              }} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                 All Red
              </button>
              <button onClick={() => {
                const past = events.filter(e => e.date < todayStr);
                setEvents(events.filter(e => e.date >= todayStr));
                if (past.length > 0) alert(`Deleted ${past.length} past event(s)`);
              }} style={{ padding: '8px 16px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                Delete Past
              </button>
              <button onClick={() => {
                setEvents([]);
              }} style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                Clear All
              </button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Filter & Export:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => {
                const todayEvents = events.filter(e => e.date === todayStr);
                alert(`Today's Events (${todayEvents.length}):\n\n${todayEvents.map(e => `${e.title} (${e.startTime}-${e.endTime})`).join('\n')}`);
              }} style={{ padding: '8px 16px', background: '#14b8a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                 Show Today
              </button>
              <button onClick={() => {
                const json = JSON.stringify(events, null, 2);
                navigator.clipboard.writeText(json);
                alert('Events copied to clipboard!');
              }} style={{ padding: '8px 16px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                 Copy JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div style={{ marginBottom: '24px', padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1f2937' }}> Calendar Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Initial View</label>
            <select 
              value={calendarConfig.initialView} 
              onChange={(e) => setCalendarConfig({...calendarConfig, initialView: e.target.value})} 
              style={{ width: '100%', padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: 'white' }}
            >
              <option value="day">Day View</option>
              <option value="week">Week View</option>
              <option value="month">Month View</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Header Format</label>
            <select 
              value={calendarConfig.headerFormat} 
              onChange={(e) => setCalendarConfig({...calendarConfig, headerFormat: e.target.value})} 
              style={{ width: '100%', padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: 'white' }}
            >
              <option value="full">Full Names</option>
              <option value="short">Short Names</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Disabled Hours</label>
            <select 
              multiple
              value={calendarConfig.disabledHours.map(String)}
              onChange={(e) => setCalendarConfig({...calendarConfig, disabledHours: Array.from(e.target.selectedOptions, option => parseInt(option.value))})} 
              style={{ width: '100%', padding: '8px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', background: 'white', minHeight: '80px' }}
            >
              {Array.from({length: 24}, (_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={calendarConfig.editable} 
              onChange={(e) => setCalendarConfig({...calendarConfig, editable: e.target.checked})} 
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            Editable
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={calendarConfig.showHolidays} 
              onChange={(e) => setCalendarConfig({...calendarConfig, showHolidays: e.target.checked})} 
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            Show Persian Holidays
          </label>
        </div>
      </div>

      {/* Features Showcase */}
      <div style={{ marginBottom: '24px', padding: '24px', background: 'linear-gradient(135deg, #6366f115 0%, #8b5cf615 100%)', borderRadius: '12px', border: '2px solid #6366f130' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '8px' }}>
           Calendar Features
        </h3>
        
        <div style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
          <div style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}> Event Management</div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#6b7280', lineHeight: '1.8' }}>
              <li><strong>Create:</strong> Click time slots (day/week) or days (month) to open event modal</li>
              <li><strong>Edit:</strong> Click existing events to modify title, time, color, description</li>
              <li><strong>Delete:</strong> Use delete button in event modal</li>
              <li><strong>Holidays:</strong> Click Persian holidays to view details in modal</li>
              <li><strong>Callbacks:</strong> onEventCreate, onEventUpdate, onEventDelete props</li>
            </ul>
          </div>

          <div style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}> Overlap Detection</div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#6b7280', lineHeight: '1.8' }}>
              <li>Automatically detects overlapping events in same time slot</li>
              <li>Shows orange badge with count (e.g., "2 تداخل")</li>
              <li>Highlights slots with light orange background</li>
              <li>Displays overlapping events side-by-side in day view</li>
            </ul>
          </div>

          <div style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}> Event Modal Form</div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#6b7280', lineHeight: '1.8' }}>
              <li>Title input field</li>
              <li>Start/End time pickers</li>
              <li>Color picker for event customization</li>
              <li>Description textarea</li>
              <li>Save/Cancel/Delete action buttons</li>
            </ul>
          </div>
        </div>

        <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
          <div style={{ fontSize: '13px', color: '#92400e' }}>
            <strong>Quick Tip:</strong> Try creating overlapping events at 9:00 and 9:30 to see the overlap detection in action!
          </div>
        </div>
      </div>

      {/* Calendar */}
      <PersianCalendar
        events={events}
        onEventCreate={(event) => {
          setEvents([...events, event]);
          logAction('Created', event);
          logCallback('onEventCreate', event);
        }}
        onEventUpdate={(updatedEvent) => {
          setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
          logAction('Updated', updatedEvent);
          logCallback('onEventUpdate', updatedEvent);
        }}
        onEventDelete={(deletedEvent) => {
          setEvents(events.filter(e => e.id !== deletedEvent.id));
          logAction('Deleted', deletedEvent);
          logCallback('onEventDelete', deletedEvent);
        }}
        onEventClick={(event) => {
          if (!event.isHoliday) {
            logAction('Clicked', event);
          }
          logCallback('onEventClick', event);
        }}
        theme={theme}
        {...calendarConfig}
        disabledHours={calendarConfig.disabledHours}
      />

      {/* Callback Output */}
      <div style={{ marginTop: '24px', padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1f2937' }}> Callback Output (Last 5)</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {callbackLog.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>No callbacks triggered yet</div>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {callbackLog.map(log => (
                <div key={log.id} style={{ padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <code style={{ fontWeight: '600', color: '#6366f1', fontSize: '13px' }}>{log.type}</code>
                    <span style={{ color: '#9ca3af', fontSize: '11px' }}>{log.timestamp}</span>
                  </div>
                  <pre style={{ margin: 0, fontSize: '11px', color: '#6b7280', overflowX: 'auto', background: '#f9fafb', padding: '8px', borderRadius: '4px' }}>
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event List and Activity Log */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
        {/* Event List */}
        <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
             Events List ({events.length})
          </h3>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>
                No events yet. Click on the calendar to create one!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '8px' }}>
                {events.map(e => (
                  <div 
                    key={e.id} 
                    style={{ 
                      padding: '12px 16px', 
                      background: 'white', 
                      borderRadius: '8px', 
                      borderLeft: `4px solid ${e.color}`,
                      borderTop: '1px solid #e5e7eb',
                      borderRight: '1px solid #e5e7eb',
                      borderBottom: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px', color: '#1f2937' }}>{e.title}</div>
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>
                        {e.date} | {e.startTime} - {e.endTime}
                      </div>
                    </div>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      background: e.color 
                    }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Activity Log
          </h3>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {eventLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>
                No activity yet
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '8px' }}>
                {eventLog.map(log => (
                  <div 
                    key={log.id} 
                    style={{ 
                      padding: '12px', 
                      background: 'white', 
                      borderRadius: '8px',
                      fontSize: '13px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ 
                        fontWeight: '600', 
                        color: log.action === 'Created' ? '#10b981' : log.action === 'Deleted' ? '#ef4444' : '#6366f1' 
                      }}>
                        {log.action}
                      </span>
                      <span style={{ color: '#9ca3af', fontSize: '11px' }}>{log.time}</span>
                    </div>
                    <div style={{ color: '#6b7280' }}>{log.event}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Output JSON */}
      <div style={{ marginTop: '24px', padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>
          🔍 Events Output (JSON)
        </h3>
        <pre style={{ 
          margin: 0, 
          padding: '16px', 
          background: '#1f2937', 
          color: '#10b981', 
          borderRadius: '8px', 
          fontSize: '12px', 
          overflowX: 'auto',
          fontFamily: 'monospace'
        }}>
          {JSON.stringify(events, null, 2)}
        </pre>
      </div>

      {/* Code Example */}
      {codeExample && (
        <div style={{ marginTop: '24px', position: 'relative', padding: '16px', background: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#4ec9b0' }}>Code Example</div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(codeExample);
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
            <code>{codeExample}</code>
          </pre>
        </div>
      )}
    </>
  );
}

export default CalendarDemo;
