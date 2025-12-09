# Persian Calendar Suite

A comprehensive Persian (Jalali/Shamsi) calendar suite for React with datepicker, range picker, event calendar, and multiple output formats.

[![npm version](https://img.shields.io/npm/v/persian-calendar-suite.svg)](https://www.npmjs.com/package/persian-calendar-suite)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**[Live Demo](https://bbbird1450.github.io/persian-calendar-suite/)** | [Documentation](#table-of-contents)

## Table of Contents

- [Installation](#installation)
- [Compatibility](#compatibility)
- [Quick Start](#quick-start)
- [Components](#components)
  - [PersianDateTimePicker](#persiandatetimepicker)
  - [PersianDateRangePicker](#persiandaterangepicker)
  - [PersianCalendar](#persiancalendar)
- [Theme Customization](#theme-customization)
- [Output Formats](#output-formats)
- [Programmatic Control](#programmatic-control)
- [Examples](#examples)
- [Browser Support](#browser-support)
- [License](#license)

## Installation

```bash
npm install persian-calendar-suite
```

or with yarn:

```bash
yarn add persian-calendar-suite
```

## Compatibility

- **React**: +16.8 (Hooks required)
- **React DOM**: +16.8
- **Next.js**: +12  (Client-side components)
- **Node**: 12+

### Peer Dependencies

```bash
npm install react react-dom
```

## Quick Start

### React

```jsx
import React, { useState } from 'react';
import { PersianDateTimePicker } from 'persian-calendar-suite';

function App() {
  const [date, setDate] = useState(null);

  return (
    <PersianDateTimePicker
      value={date}
      onChange={setDate}
    />
  );
}
```

### Next.js

```jsx
'use client'; // Required for Next.js 13+ App Router

import { useState } from 'react';
import { PersianDateTimePicker } from 'persian-calendar-suite';

export default function Page() {
  const [date, setDate] = useState(null);

  return (
    <PersianDateTimePicker
      value={date}
      onChange={setDate}
    />
  );
}
```

## Components

### PersianDateTimePicker

Single date and time picker with Shamsi calendar.

#### Import

```jsx
import { PersianDateTimePicker } from 'persian-calendar-suite';
```

#### Basic Usage

```jsx
const [value, setValue] = useState(null);

<PersianDateTimePicker
  value={value}
  onChange={setValue}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number \| null` | `null` | Selected date value |
| `onChange` | `(value: string \| number) => void` | - | Callback when date changes |
| `showTime` | `boolean` | `true` | Show time picker |
| `minuteStep` | `number` | `1` | Minute step interval |
| `outputFormat` | `'iso' \| 'shamsi' \| 'gregorian' \| 'hijri' \| 'timestamp'` | `'iso'` | Output format |
| `showFooter` | `boolean` | `true` | Show OK/Cancel buttons |
| `theme` | `ThemeObject` | `{}` | Theme customization |
| `disabledHours` | `number[]` | `[]` | Array of disabled hours |

#### Example with Options

```jsx
<PersianDateTimePicker
  value={value}
  onChange={setValue}
  showTime={true}
  outputFormat="shamsi"
  showFooter={false}
  theme={{
    primaryColor: '#6366f1',
    circularDates: true
  }}
/>
```

---

### PersianDateRangePicker

Date range picker with dual calendars.

#### Import

```jsx
import { PersianDateRangePicker } from 'persian-calendar-suite';
```

#### Basic Usage

```jsx
const [range, setRange] = useState(null);

<PersianDateRangePicker
  value={range}
  onChange={setRange}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `[string, string] \| null` | `null` | Selected range [start, end] |
| `onChange` | `(value: [string, string]) => void` | - | Callback when range changes |
| `placeholder` | `[string, string]` | `['تاریخ شروع', 'تاریخ پایان']` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the picker |
| `outputFormat` | `'iso' \| 'shamsi' \| 'gregorian' \| 'hijri' \| 'timestamp'` | `'iso'` | Output format |
| `showFooter` | `boolean` | `true` | Show OK/Cancel buttons |
| `theme` | `ThemeObject` | `{}` | Theme customization |

#### Example with Options

```jsx
<PersianDateRangePicker
  value={range}
  onChange={setRange}
  placeholder={['Start', 'End']}
  outputFormat="timestamp"
  theme={{
    primaryColor: '#10b981'
  }}
/>
```

---

### PersianCalendar

Full-featured calendar with event management (like FullCalendar).

#### Import

```jsx
import { PersianCalendar } from 'persian-calendar-suite';
```

#### Basic Usage

```jsx
const [events, setEvents] = useState([]);

<PersianCalendar
  events={events}
  onEventCreate={(event) => setEvents([...events, event])}
  onEventUpdate={(updated) => setEvents(events.map(e => e.id === updated.id ? updated : e))}
  onEventDelete={(deleted) => setEvents(events.filter(e => e.id !== deleted.id))}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `events` | `Event[]` | `[]` | Array of event objects |
| `onEventCreate` | `(event: Event) => void` | - | Callback when event is created |
| `onEventUpdate` | `(event: Event) => void` | - | Callback when event is updated |
| `onEventDelete` | `(event: Event) => void` | - | Callback when event is deleted |
| `onEventClick` | `(event: Event) => void` | - | Callback when event is clicked |
| `initialView` | `'day' \| 'week' \| 'month'` | `'month'` | Initial view mode |
| `editable` | `boolean` | `true` | Enable event creation/editing |
| `showWeekends` | `boolean` | `true` | Show weekend days |
| `headerFormat` | `'full' \| 'short'` | `'full'` | Header format |
| `theme` | `ThemeObject` | `{}` | Theme customization |

#### Event Object

```typescript
{
  id: number;           // Unique identifier
  date: string;         // ISO date string (YYYY-MM-DD)
  startTime: string;    // Start time (HH:mm)
  endTime: string;      // End time (HH:mm)
  title: string;        // Event title
  color: string;        // Event color (hex)
  description?: string; // Event description (optional)
}
```

#### Creating Events

**Day View**: Click on hour slots (00:00 - 23:00)
```jsx
// User clicks on 09:00 slot
// Modal opens with startTime: "09:00", endTime: "10:00"
```

**Week View**: Click on time cells for any day
```jsx
// User clicks on Tuesday 14:00
// Modal opens for that specific day and time
```

**Month View**: Click on day cells
```jsx
// User clicks on day 15
// Modal opens with default time 09:00
```

#### Editing Events

Click on any existing event to open the edit modal:
- Modify title, start/end time, color, description
- Delete button available in modal
- Changes trigger `onEventUpdate` callback

#### Overlap Detection

Automatically detects overlapping events:
- Shows orange badge with count (e.g., "2 تداخل")
- Highlights slots with light orange background
- Displays events side-by-side in day view

#### Full Example

```jsx
const [events, setEvents] = useState([
  {
    id: 1,
    date: '2024-12-10',
    startTime: '09:00',
    endTime: '10:00',
    title: 'Team Meeting',
    color: '#10b981',
    description: 'Weekly team sync'
  }
]);

<PersianCalendar
  events={events}
  onEventCreate={(event) => {
    console.log('Created:', event);
    setEvents([...events, event]);
  }}
  onEventUpdate={(updated) => {
    console.log('Updated:', updated);
    setEvents(events.map(e => e.id === updated.id ? updated : e));
  }}
  onEventDelete={(deleted) => {
    console.log('Deleted:', deleted);
    setEvents(events.filter(e => e.id !== deleted.id));
  }}
  onEventClick={(event) => {
    console.log('Clicked:', event);
  }}
  initialView="day"
  editable={true}
  theme={{
    primaryColor: '#6366f1'
  }}
/>
```

## Theme Customization

All components support theme customization via the `theme` prop.

### Theme Object

```typescript
{
  primaryColor?: string;      // Primary color (default: '#1890ff')
  backgroundColor?: string;   // Background color (default: '#ffffff')
  textColor?: string;         // Text color (default: '#000000')
  borderColor?: string;       // Border color (default: '#d9d9d9')
  hoverColor?: string;        // Hover color (default: '#f0f0f0')
  selectedTextColor?: string; // Selected text color (default: '#ffffff')
  circularDates?: boolean;    // Circular date cells (default: false)
  // Calendar specific
  headerBg?: string;          // Header background (default: '#fafafa')
  eventRadius?: string;       // Event border radius (default: '6px')
  shadow?: string;            // Shadow (default: '0 2px 8px rgba(0,0,0,0.08)')
}
```

### Example

```jsx
const customTheme = {
  primaryColor: '#6366f1',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderColor: '#e5e7eb',
  hoverColor: '#f3f4f6',
  circularDates: true
};

<PersianDateTimePicker
  value={value}
  onChange={setValue}
  theme={customTheme}
/>
```

## Output Formats

### ISO 8601 (default)
```
2024-12-10T14:30:00
```

### Shamsi
```
1403/09/20 14:30
```

### Gregorian
```
2024/12/10 14:30
```

### Hijri
```
1446/06/08 14:30
```

### Timestamp
```
1702217400000
```

### Changing Format

```jsx
<PersianDateTimePicker
  value={value}
  onChange={setValue}
  outputFormat="shamsi"  // or 'iso', 'gregorian', 'hijri', 'timestamp'
/>
```

## Programmatic Control

### Reading Data

All components are **controlled** - you manage the state:

```jsx
const [date, setDate] = useState(null);
const [range, setRange] = useState(null);
const [events, setEvents] = useState([]);

// Read current values anytime
console.log('Current date:', date);
console.log('Current range:', range);
console.log('All events:', events);
```

### Setting Data Programmatically

#### Set Date/Time

```jsx
const [date, setDate] = useState(null);

// Set to current date
setDate(new Date().toISOString());

// Set specific date (ISO format)
setDate('2024-12-10T14:30:00');

// Set via timestamp
setDate(1702217400000);

// Clear date
setDate(null);
```

#### Set Date Range

```jsx
const [range, setRange] = useState(null);

// Set range
setRange(['2024-12-01T00:00:00', '2024-12-31T23:59:59']);

// Set last 7 days
const end = new Date();
const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
setRange([start.toISOString(), end.toISOString()]);

// Clear range
setRange(null);
```

#### Manage Events

```jsx
const [events, setEvents] = useState([]);

// Add event programmatically
const addEvent = () => {
  const newEvent = {
    id: Date.now(),
    date: '2024-12-15',
    startTime: '10:00',
    endTime: '11:00',
    title: 'New Meeting',
    color: '#3b82f6',
    description: 'Auto-created event'
  };
  setEvents([...events, newEvent]);
};

// Update specific event
const updateEvent = (id, updates) => {
  setEvents(events.map(e => 
    e.id === id ? { ...e, ...updates } : e
  ));
};

// Delete event
const deleteEvent = (id) => {
  setEvents(events.filter(e => e.id !== id));
};

// Clear all events
setEvents([]);

// Load events from API
fetch('/api/events')
  .then(res => res.json())
  .then(data => setEvents(data));
```

### Dynamic Updates

#### Auto-select Today

```jsx
const [date, setDate] = useState(new Date().toISOString());

// Update to today on mount
useEffect(() => {
  setDate(new Date().toISOString());
}, []);
```

#### Filter Events by Date

```jsx
const [events, setEvents] = useState([...]);
const [selectedDate, setSelectedDate] = useState('2024-12-10');

// Get events for specific date
const todayEvents = events.filter(e => e.date === selectedDate);

// Get events in date range
const rangeEvents = events.filter(e => 
  e.date >= '2024-12-01' && e.date <= '2024-12-31'
);
```

#### Bulk Operations

```jsx
// Change all event colors
const changeAllColors = (newColor) => {
  setEvents(events.map(e => ({ ...e, color: newColor })));
};

// Shift all events by 1 hour
const shiftEvents = () => {
  setEvents(events.map(e => ({
    ...e,
    startTime: addHour(e.startTime),
    endTime: addHour(e.endTime)
  })));
};

// Delete events by criteria
const deletePastEvents = () => {
  const today = new Date().toISOString().split('T')[0];
  setEvents(events.filter(e => e.date >= today));
};
```

### Responding to Changes

```jsx
// Track date changes
const [date, setDate] = useState(null);

useEffect(() => {
  if (date) {
    console.log('Date changed to:', date);
    // Trigger API call, validation, etc.
  }
}, [date]);

// Track event changes
const [events, setEvents] = useState([]);

useEffect(() => {
  console.log('Events updated:', events.length);
  // Save to localStorage, sync with backend, etc.
  localStorage.setItem('events', JSON.stringify(events));
}, [events]);
```

### Complete Interactive Example

```jsx
function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Add event via button
  const addQuickEvent = () => {
    setEvents([...events, {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      title: 'Quick Event',
      color: '#10b981'
    }]);
  };

  // Jump to specific date
  const jumpToDate = (dateStr) => {
    setSelectedDate(dateStr);
  };

  // Export events
  const exportEvents = () => {
    const json = JSON.stringify(events, null, 2);
    console.log(json);
    // Download or send to API
  };

  // Import events
  const importEvents = (jsonData) => {
    setEvents(JSON.parse(jsonData));
  };

  return (
    <div>
      <button onClick={addQuickEvent}>Add Event</button>
      <button onClick={() => jumpToDate('2024-12-25')}>Jump to Dec 25</button>
      <button onClick={exportEvents}>Export</button>
      
      <PersianCalendar
        events={events}
        onEventCreate={(e) => setEvents([...events, e])}
        onEventUpdate={(e) => setEvents(events.map(ev => ev.id === e.id ? e : ev))}
        onEventDelete={(e) => setEvents(events.filter(ev => ev.id !== e.id))}
      />
    </div>
  );
}
```

## Examples

### DateTime Picker with Time

```jsx
<PersianDateTimePicker
  value={value}
  onChange={setValue}
  showTime={true}
  minuteStep={15}
/>
```

### Date Only (No Time)

```jsx
<PersianDateTimePicker
  value={value}
  onChange={setValue}
  showTime={false}
/>
```

### Auto-close (No Footer)

```jsx
<PersianDateTimePicker
  value={value}
  onChange={setValue}
  showFooter={false}
/>
```

### Range Picker with Timestamp

```jsx
<PersianDateRangePicker
  value={range}
  onChange={setRange}
  outputFormat="timestamp"
/>
```

### Calendar with Custom Theme

```jsx
<PersianCalendar
  events={events}
  onEventCreate={handleCreate}
  onEventUpdate={handleUpdate}
  onEventDelete={handleDelete}
  theme={{
    primaryColor: '#ef4444',
    headerBg: '#fee2e2',
    eventRadius: '12px'
  }}
/>
```

### Read-only Calendar

```jsx
<PersianCalendar
  events={events}
  onEventClick={handleClick}
  editable={false}
/>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

MIT © BBBird1450

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/BBBird1450/persian-calendar-suite/issues)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.
