import { FlatpickrFn } from '../types/instance';
import { FPWindowOptional } from '../types/globals';

/* Austria locals for flatpickr */
import { CustomLocale } from '../types/locale';

const fp =
  typeof window !== 'undefined' && (window as FPWindowOptional).flatpickr !== undefined
    ? (window as FPWindowOptional).flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Austria: CustomLocale = {
  weekdays: {
    shorthand: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    longhand: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  },

  months: {
    shorthand: ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    longhand: [
      'Jänner',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ],
  },

  firstDayOfWeek: 1,
  weekAbbreviation: 'KW',
  rangeSeparator: ' bis ',
  scrollTitle: 'Zum Ändern scrollen',
  toggleTitle: 'Zum Umschalten klicken',
  time_24hr: true,
};

fp.l10ns.at = Austria;

export default fp.l10ns;
