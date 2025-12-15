# Changelog

All notable changes to this project will be documented in this file.

## [1.1.5] - 2024-12-13

### Added
- "Now" button in PersianTimePicker to quickly set current time
- Updated "Today" button in PersianDateTimePicker to "Now" - sets both current date and time
- Persian number display support for all components (DateTimePicker, DateRangePicker, TimePicker)
- RTL calendar layout support for DateTimePicker and DateRangePicker
- Improved checkbox styling in demo with hover effects and accent colors

## [1.1.4] - 2024-12-13

### Added
- Persian number display option (`persianNumbers` prop) for showing digits in Persian format
- RTL calendar layout option (`rtlCalendar` prop) to start weekdays from right (Saturday first)
- Added PersianTimePicker component documentation in README

## [1.1.3] - 2024-12-13

### Fixed
- Fixed scroll inside picker closing the dropdown
- Updated input styling
- Improved input appearance with proper border radius and padding

## [1.1.2] - 2024-12-13

### Fixed
- Added React import to fix "React is not defined" error in external projects

## [1.1.1] - 2024-12-13

### Fixed
- Output format changes now update immediately in demo
- Mobile responsiveness for PersianDateTimePicker with centered modal positioning
- Touch-friendly sizing with larger targets (36px) and fonts (16px) on mobile
- Time picker switches to vertical layout on mobile devices

## [1.1.0] - 2024-12-13

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

## [1.0.4] - 2024-12-12

### Added
- Recurring events (daily, weekly, monthly, yearly)
- All-day events with special styling
- Multi-day events spanning across dates
- Today button for quick navigation
- Event tooltips on hover with details

## [1.0.3] - 2024-12-12

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
