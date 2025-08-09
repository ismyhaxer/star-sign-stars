import { ZodiacSign } from '../types/game';

export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    symbol: '♈',
    element: 'fire',
    dateRange: {
      start: { month: 3, day: 21 },
      end: { month: 4, day: 19 }
    }
  },
  {
    name: 'Taurus',
    symbol: '♉',
    element: 'earth',
    dateRange: {
      start: { month: 4, day: 20 },
      end: { month: 5, day: 20 }
    }
  },
  {
    name: 'Gemini',
    symbol: '♊',
    element: 'air',
    dateRange: {
      start: { month: 5, day: 21 },
      end: { month: 6, day: 20 }
    }
  },
  {
    name: 'Cancer',
    symbol: '♋',
    element: 'water',
    dateRange: {
      start: { month: 6, day: 21 },
      end: { month: 7, day: 22 }
    }
  },
  {
    name: 'Leo',
    symbol: '♌',
    element: 'fire',
    dateRange: {
      start: { month: 7, day: 23 },
      end: { month: 8, day: 22 }
    }
  },
  {
    name: 'Virgo',
    symbol: '♍',
    element: 'earth',
    dateRange: {
      start: { month: 8, day: 23 },
      end: { month: 9, day: 22 }
    }
  },
  {
    name: 'Libra',
    symbol: '♎',
    element: 'air',
    dateRange: {
      start: { month: 9, day: 23 },
      end: { month: 10, day: 22 }
    }
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    element: 'water',
    dateRange: {
      start: { month: 10, day: 23 },
      end: { month: 11, day: 21 }
    }
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    dateRange: {
      start: { month: 11, day: 22 },
      end: { month: 12, day: 21 }
    }
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    dateRange: {
      start: { month: 12, day: 22 },
      end: { month: 1, day: 19 }
    }
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    element: 'air',
    dateRange: {
      start: { month: 1, day: 20 },
      end: { month: 2, day: 18 }
    }
  },
  {
    name: 'Pisces',
    symbol: '♓',
    element: 'water',
    dateRange: {
      start: { month: 2, day: 19 },
      end: { month: 3, day: 20 }
    }
  }
];

export const calculateZodiacSign = (birthday: string): ZodiacSign => {
  const date = new Date(birthday);
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  for (const sign of zodiacSigns) {
    const { start, end } = sign.dateRange;
    
    // Handle signs that cross year boundary (like Capricorn)
    if (start.month > end.month) {
      if ((month === start.month && day >= start.day) || 
          (month === end.month && day <= end.day)) {
        return sign;
      }
    } else {
      if ((month === start.month && day >= start.day) || 
          (month === end.month && day <= end.day) ||
          (month > start.month && month < end.month)) {
        return sign;
      }
    }
  }
  
  // Fallback (shouldn't happen with valid dates)
  return zodiacSigns[0];
};

export const formatBirthday = (birthday: string): string => {
  const date = new Date(birthday);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};