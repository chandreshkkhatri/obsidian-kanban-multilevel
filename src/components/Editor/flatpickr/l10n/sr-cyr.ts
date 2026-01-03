import { FlatpickrFn } from '../types/instance';
import { FPWindowOptional } from '../types/globals';

/* Serbian Cyrillic locals for flatpickr */
import { CustomLocale } from '../types/locale';

const fp =
  typeof window !== 'undefined' && (window as FPWindowOptional).flatpickr !== undefined
    ? (window as FPWindowOptional).flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const SerbianCyrillic: CustomLocale = {
  weekdays: {
    shorthand: ['Нед', 'Пон', 'Уто', 'Сре', 'Чет', 'Пет', 'Суб'],
    longhand: ['Недеља', 'Понедељак', 'Уторак', 'Среда', 'Четвртак', 'Петак', 'Субота'],
  },

  months: {
    shorthand: ['Јан', 'Феб', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Авг', 'Сеп', 'Окт', 'Нов', 'Дец'],
    longhand: [
      'Јануар',
      'Фебруар',
      'Март',
      'Април',
      'Мај',
      'Јун',
      'Јул',
      'Август',
      'Септембар',
      'Октобар',
      'Новембар',
      'Децембар',
    ],
  },

  firstDayOfWeek: 1,
  weekAbbreviation: 'Нед.',
  rangeSeparator: ' до ',
};

fp.l10ns.sr = SerbianCyrillic;

export default fp.l10ns;
