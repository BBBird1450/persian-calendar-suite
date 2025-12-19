// Persian Moment - Jalali date utility
class PersianMoment {
  constructor(input, format) {
    if (input && format === 'jYYYY/jMM/jDD') {
      const [jy, jm, jd] = input.split('/').map(Number);
      this.jy = jy;
      this.jm = jm;
      this.jd = jd;
      const greg = jalaliToGregorian(jy, jm, jd);
      this.date = new Date(greg.gy, greg.gm - 1, greg.gd);
    } else if (input && format === 'YYYY/MM/DD') {
      const [gy, gm, gd] = input.split('/').map(Number);
      this.date = new Date(gy, gm - 1, gd);
      const jalali = gregorianToJalali(gy, gm, gd);
      this.jy = jalali.jy;
      this.jm = jalali.jm;
      this.jd = jalali.jd;
    } else {
      this.date = new Date(input || Date.now());
      const jalali = gregorianToJalali(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate());
      this.jy = jalali.jy;
      this.jm = jalali.jm;
      this.jd = jalali.jd;
    }
  }

  diff(other, unit, outputFormat = 'number') {
    const diffMs = this.date - other.date;
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.round(diffDays / 7);
    const diffMonths = (this.jy - other.jy) * 12 + (this.jm - other.jm);
    const diffYears = this.jy - other.jy;
    
    let value, autoUnit;
    
    if (unit === 'auto') {
      const absDays = Math.abs(diffDays);
      const absHours = Math.abs(diffHours);
      const absMinutes = Math.abs(diffMinutes);
      const absWeeks = Math.abs(diffWeeks);
      const absMonths = Math.abs(diffMonths);
      const absYears = Math.abs(diffYears);
      
      if (absMinutes < 60) {
        value = diffMinutes;
        autoUnit = 'minute';
      } else if (absHours < 24) {
        value = diffHours;
        autoUnit = 'hour';
      } else if (absDays < 7) {
        value = diffDays;
        autoUnit = 'day';
      } else if (absDays < 28) {
        value = diffWeeks;
        autoUnit = 'week';
      } else if (absMonths < 12 && absMonths > 0) {
        value = diffMonths;
        autoUnit = 'jMonth';
      } else {
        value = diffYears;
        autoUnit = 'jYear';
      }
    } else {
      if (unit === 'day' || unit === 'jDay') value = diffDays;
      else if (unit === 'jMonth') value = diffMonths;
      else if (unit === 'jYear') value = diffYears;
      else value = diffDays;
      autoUnit = unit;
    }
    
    return this.formatOutput(value, autoUnit, outputFormat);
  }

  add(amount, unit) {
    if (unit === 'jDay') {
      let newJd = this.jd + amount;
      let newJm = this.jm;
      let newJy = this.jy;
      
      while (newJd > getDaysInJalaliMonth(newJy, newJm)) {
        newJd -= getDaysInJalaliMonth(newJy, newJm);
        newJm++;
        if (newJm > 12) {
          newJm = 1;
          newJy++;
        }
      }
      
      while (newJd < 1) {
        newJm--;
        if (newJm < 1) {
          newJm = 12;
          newJy--;
        }
        newJd += getDaysInJalaliMonth(newJy, newJm);
      }
      
      this.jy = newJy;
      this.jm = newJm;
      this.jd = newJd;
      const greg = jalaliToGregorian(newJy, newJm, newJd);
      this.date = new Date(greg.gy, greg.gm - 1, greg.gd);
    }
    return this;
  }

  format(format) {
    const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const toPersianDigits = (str) => str.toString().replace(/\d/g, (digit) => PERSIAN_DIGITS[parseInt(digit)]);
    
    const JALALI_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    const GREGORIAN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const JALALI_DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
    const GREGORIAN_DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    const dayOfWeek = this.date.getDay();
    
    if (format === 'jYYYY/jMM/jDD') {
      return `${this.jy}/${String(this.jm).padStart(2, '0')}/${String(this.jd).padStart(2, '0')}`;
    }
    if (format === 'YYYY/MM/DD') {
      return `${this.date.getFullYear()}/${String(this.date.getMonth() + 1).padStart(2, '0')}/${String(this.date.getDate()).padStart(2, '0')}`;
    }
    if (format === 'jDD jMMMM jYYYY') {
      return `${toPersianDigits(this.jd)} ${JALALI_MONTHS[this.jm - 1]} ${toPersianDigits(this.jy)}`;
    }
    if (format === 'jDDDD jDD jMMMM jYYYY') {
      return `${JALALI_DAYS[dayOfWeek]} ${toPersianDigits(this.jd)} ${JALALI_MONTHS[this.jm - 1]} ${toPersianDigits(this.jy)}`;
    }
    if (format === 'jDDDD jDD jMMM') {
      return `${JALALI_DAYS[dayOfWeek]} ${toPersianDigits(this.jd)} ${JALALI_MONTHS[this.jm - 1]}`;
    }
    if (format === 'jDD jMMMM') {
      return `${toPersianDigits(this.jd)} ${JALALI_MONTHS[this.jm - 1]}`;
    }
    if (format === 'jMMMM jYYYY') {
      return `${JALALI_MONTHS[this.jm - 1]} ${toPersianDigits(this.jy)}`;
    }
    if (format === 'jDDDD') {
      return JALALI_DAYS[dayOfWeek];
    }
    if (format === 'jMMMM') {
      return JALALI_MONTHS[this.jm - 1];
    }
    if (format === 'DD MMMM YYYY') {
      return `${this.date.getDate()} ${GREGORIAN_MONTHS[this.date.getMonth()]} ${this.date.getFullYear()}`;
    }
    if (format === 'DDDD DD MMMM YYYY') {
      return `${GREGORIAN_DAYS[dayOfWeek]} ${this.date.getDate()} ${GREGORIAN_MONTHS[this.date.getMonth()]} ${this.date.getFullYear()}`;
    }
    if (format === 'persian-numbers') {
      return `${toPersianDigits(this.jy)}/${toPersianDigits(String(this.jm).padStart(2, '0'))}/${toPersianDigits(String(this.jd).padStart(2, '0'))}`;
    }
    return this.date.toISOString();
  }
  
  formatOutput(value, unit, outputFormat) {
    const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const toPersianDigits = (str) => str.toString().replace(/\d/g, (digit) => PERSIAN_DIGITS[parseInt(digit)]);
    
    const unitNames = {
      minute: { fa: 'دقیقه', en: 'minute' },
      hour: { fa: 'ساعت', en: 'hour' },
      day: { fa: 'روز', en: 'day' },
      jDay: { fa: 'روز', en: 'day' },
      week: { fa: 'هفته', en: 'week' },
      jMonth: { fa: 'ماه', en: 'month' },
      jYear: { fa: 'سال', en: 'year' }
    };
    
    if (outputFormat === 'number') {
      const absValue = Math.abs(value);
      const unit_fa = unitNames[unit]?.fa || 'واحد';
      return value < 0 ? `${toPersianDigits(absValue)} ${unit_fa} قبل` : `${toPersianDigits(absValue)} ${unit_fa}`;
    }
    if (outputFormat === 'persian') return toPersianDigits(Math.abs(value));
    if (outputFormat === 'persian-text') {
      const absValue = Math.abs(value);
      const unit_fa = unitNames[unit]?.fa || 'واحد';
      return value < 0 ? `${toPersianDigits(absValue)} ${unit_fa} قبل` : `${toPersianDigits(absValue)} ${unit_fa}`;
    }
    if (outputFormat === 'english-text') return `${value} ${unitNames[unit]?.en || 'unit'}${Math.abs(value) !== 1 ? 's' : ''}`;

    return value;
  }
}

const persianMoment = (input, format) => new PersianMoment(input, format);

// Helper functions
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

const getDaysInJalaliMonth = (jy, jm) => {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
};

const isJalaliLeapYear = (jy) => {
  const breaks = [1, 5, 9, 13, 17, 22, 26, 30];
  let jp = breaks[0];
  let jump = 0;
  for (let i = 1; i < breaks.length; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    jp = jm;
  }
  let n = jy - jp;
  if (jump - n < 6) n = n - jump + (Math.floor((jump + 4) / 33) * 33);
  let leapJ = ((((n + 1) % 33) - 1) % 4);
  if (leapJ === -1) leapJ = 4;
  return leapJ === 0;
};

// Export available format options
persianMoment.formats = {
  jalali: {
    'jYYYY/jMM/jDD': 'Basic Jalali (1404/09/20)',
    'persian-numbers': 'Persian Digits (۱۴۰۳/۰۹/۲۰)',
    'jDD jMMMM jYYYY': 'Day Month Year (۲۰ آذر ۱۴۰۳)',
    'jDDDD jDD jMMMM jYYYY': 'Full Date (جمعه ۲۰ آذر ۱۴۰۳)',
    'jDDDD jDD jMMM': 'Day Date Month (جمعه ۲۰ آذر)',
    'jDD jMMMM': 'Day Month (۲۰ آذر)',
    'jMMMM jYYYY': 'Month Year (آذر ۱۴۰۳)',
    'jDDDD': 'Day Name (جمعه)',
    'jMMMM': 'Month Name (آذر)'
  },
  gregorian: {
    'YYYY/MM/DD': 'Basic Gregorian (2025/12/10)',
    'DD MMMM YYYY': 'Day Month Year (10 December 2025)',
    'DDDD DD MMMM YYYY': 'Full Date (Friday 10 December 2025)',
    'iso': 'ISO Format (2025-12-10T00:00:00.000Z)'
  },
  diff: {
    'number': 'Number (5)',
    'persian': 'Persian Digits (۵)',
    'persian-text': 'Persian Text (۵ روز)',
    'english-text': 'English Text (5 days)'
  }
};

export default persianMoment;