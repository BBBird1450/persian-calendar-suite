# Changelog

All notable changes to this project will be documented in this file.

## [1.5.2] - 2025-12-27

### Added

- 4-column layout for time range picker (از-ساعت, از-دقیقه, تا-ساعت, تا-دقیقه)
- Persian digits in calendar navigation text
- Holiday integration in PersianDateRangePicker via Time.ir API

### Fixed

- RTL layout issues in all calendar components
- Navigation arrows now work correctly (reversed for RTL)
- Week view time column moved to right side
- Day view time labels moved to right side
- Week view days now properly ordered right-to-left
- Week view now shows correct days for current week calculation
- Weekday headers reversed to match RTL layout
- Date range picker navigation arrows fixed
- Time.ir API calls now always use CORS proxy (removed direct calls)

## [1.5.0] - 2025-12-19

### Added

- PersianMoment utility for Jalali date arithmetic and conversions
- Support for multiple input formats (Jalali, Gregorian, ISO)
- Date difference calculations with Persian text output
- Format conversion between different calendar systems
- Persian number display in date calculations
- RTL calendar layout with proper weekday header direction
- Flexible output formatting with day names, month names, and combinations
- Persian "قبل" (ago) format for negative date differences
- 13 Jalali format options (basic, Persian digits, full dates with day names)
- 4 Gregorian format options (basic, full dates with day names)
- 4 difference output formats (number, Persian digits, Persian text, English text)
- Disabled hours support in PersianCalendar for time slot restrictions
- Visual indicators for disabled time slots in day view
- Persian holiday integration via Time.ir API for all calendar components
- `usePersianHolidays` React hook for fetching Persian holidays
- Holiday display with red highlighting and special styling
- Holiday events are read-only and clickable for details
- `showHolidays` prop for all calendar components (default: false)
- RTL calendar layout enabled by default for all components
- Holiday details modal with proper Persian styling instead of browser alerts
- Comprehensive mobile responsiveness for all calendar components
- Mobile-optimized event calendar with compact cells and smaller fonts
- Mobile-friendly holiday modal with full-width layout
- Responsive weekday headers and navigation buttons for mobile
- Mobile-optimized date range picker with stacked layout

### Fixed

- Navigation arrows now work correctly in RTL layout (reversed direction)
- Holiday date format conversion from Jalali to Gregorian
- Month navigation arrows in PersianDateTimePicker, PersianDateRangePicker, and PersianCalendar
- Mobile month view layout with proper cell heights and event sizing
- Holiday modal replaces browser alerts with professional UI
- RTL calendar positioning in PersianDateRangePicker
- Mobile responsiveness issues in calendar headers and buttons
- Event text truncation and sizing on mobile devices


## [1.2.0] - 2025-12-13

### Added
- PersianTimeline component for chronological event visualization
- Support for vertical and horizontal timeline orientations
- Customizable event markers (circular/rectangular shapes)
- Event icons and images support
- Alternating event layout for vertical timelines
- Persian date formatting in timeline events
- Timeline-specific theme customization (lineColor, markerSize)
- Time range picker mode for PersianTimePicker (`isRange` prop)
- Returns array `[startTime, endTime]` when isRange is enabled
- Mobile responsive design for PersianDateRangePicker
- Centered modal positioning on mobile devices
- Smaller sizing on mobile (240px width, 30px days, 8px padding)
- Mobile responsive PersianTimeline component
- Adaptive sizing for timeline events and markers on mobile
- Disabled alternating layout on mobile for better readability

### Fixed
- Scroll inside PersianDateRangePicker no longer closes the dropdown
- Timeline layout issues on mobile devices (both vertical and horizontal)
- Event card sizing and spacing optimized for mobile screens
- RTL calendar weekday headers now use LTR direction for proper alignment
- React 19 compatibility added to peer dependencies
- Disabled hours are now visually indicated in calendar day view with grayed out appearance

## [1.1.6] - 2025-12-13

### Fixed
- Added React import to PersianCalendar and PersianDateRangePicker to fix "React is not defined" errors

## [1.1.5] - 2025-12-13

### Added
- "Now" button in PersianTimePicker to quickly set current time
- Updated "Today" button in PersianDateTimePicker to "Now" - sets both current date and time
- Persian number display support for all components (DateTimePicker, DateRangePicker, TimePicker)
- RTL calendar layout support for DateTimePicker and DateRangePicker
- Improved checkbox styling in demo with hover effects and accent colors

## [1.1.4] - 2025-12-13

### Added
- Persian number display option (`persianNumbers` prop) for showing digits in Persian format
- RTL calendar layout option (`rtlCalendar` prop) to start weekdays from right (Saturday first)
- Added PersianTimePicker component documentation in README

## [1.1.3] - 2025-12-13

### Fixed
- Fixed scroll inside picker closing the dropdown
- Updated input styling
- Improved input appearance with proper border radius and padding

## [1.1.2] - 2025-12-13

### Fixed
- Added React import to fix "React is not defined" error in external projects

## [1.1.1] - 2025-12-13

### Fixed
- Output format changes now update immediately in demo
- Mobile responsiveness for PersianDateTimePicker with centered modal positioning
- Touch-friendly sizing with larger targets (36px) and fonts (16px) on mobile
- Time picker switches to vertical layout on mobile devices

## [1.1.0] - 2025-12-13

### Added
- PersianTimePicker component as standalone time selector
- Default time support for PersianTimePicker (accepts 'now' or 'HH:MM' format)
- Date restrictions for PersianDateTimePicker (minDate/maxDate props)
- Manual time typing support in PersianTimePicker with HH:MM validation
- Event modal animations (smooth open/close with fade and slide effects)
- Event add/delete animations with scale effects
- Close button (×) in event modal header
- Read-only events support (events with readOnly: true cannot be edited)
- Persian date pickers in event modal instead of HTML5 date inputs

### Fixed
- Calendar header date format now shows Persian format (year month day)
- Added day name (like "سه شنبه") to day view header
- Swapped navigation button placement (بعدی left, قبلی right)

## [1.0.4] - 2025-12-12

### Added
- Recurring events (daily, weekly, monthly, yearly)
- All-day events with special styling
- Multi-day events spanning across dates
- Today button for quick navigation
- Event tooltips on hover with details

## [1.0.3] - 2025-12-12

### Fixed
- Show time in datepicker input when showTime is enabled
- Modal closes on scroll instead of floating with page
- Added RTL direction to input fields for proper Persian text alignment

## [1.0.2] - 2025-12-09

### Added
- PersianDateTimePicker component with Shamsi calendar
- PersianDateRangePicker component with dual calendars
- PersianCalendar component with event management
- Support for multiple output formats (ISO, Shamsi, Gregorian, Hijri, Timestamp)
- Theme customization support
- Day/Week/Month calendar views
- Event creation, editing, and deletion
- Event overlap detection
- Time picker with configurable minute steps
- Disabled hours support
- Footer show/hide option
- Circular date cells option
- React +16.8 compatibility
- Next.js +12 support
