import { Instance } from '../types/instance';
import { Plugin } from '../types/options';
import {
  calculateSecondsSinceMidnight,
  compareDates,
  compareTimes,
  createDateFormatter,
  parseSeconds,
} from '../utils/dates';

export interface MinMaxTime {
  minTime?: string;
  maxTime?: string;
}

export interface Config {
  table?: Record<string, MinMaxTime>;
  getTimeLimits?: (date: Date) => MinMaxTime;
  tableDateFormat?: string;
}

export interface State {
  formatDate: (date: Date, f: string) => string;
  tableDateFormat: string;
  defaults: MinMaxTime;
}

function minMaxTimePlugin(config: Config = {}): Plugin {
  const state: State = {
    formatDate: createDateFormatter({}),
    tableDateFormat: config.tableDateFormat || 'Y-m-d',
    defaults: {
      minTime: undefined,
      maxTime: undefined,
    },
  };

  function findDateTimeLimit(date: Date): MinMaxTime | undefined {
    if (config.table !== undefined) {
      return config.table[state.formatDate(date, state.tableDateFormat)];
    }

    return config.getTimeLimits && config.getTimeLimits(date);
  }

  return function (fp) {
    return {
      onReady(this: Instance) {
        state.formatDate = this.formatDate;
        state.defaults = {
          minTime: this.config.minTime && state.formatDate(this.config.minTime, 'H:i'),
          maxTime: this.config.maxTime && state.formatDate(this.config.maxTime, 'H:i'),
        };
        fp.loadedPlugins.push('minMaxTime');
      },

      onChange(this: Instance) {
        const latest = this.latestSelectedDateObj;
        const matchingTimeLimit = latest && findDateTimeLimit(latest);

        if (latest && matchingTimeLimit !== undefined) {
          this.set(matchingTimeLimit);

          (fp.config.minTime).setFullYear(latest.getFullYear());
          (fp.config.maxTime).setFullYear(latest.getFullYear());
          (fp.config.minTime).setMonth(latest.getMonth());
          (fp.config.maxTime).setMonth(latest.getMonth());
          (fp.config.minTime).setDate(latest.getDate());
          (fp.config.maxTime).setDate(latest.getDate());

          if ((fp.config.minTime) > (fp.config.maxTime)) {
            const minBound = calculateSecondsSinceMidnight(
              (fp.config.minTime).getHours(),
              (fp.config.minTime).getMinutes(),
              (fp.config.minTime).getSeconds()
            );
            const maxBound = calculateSecondsSinceMidnight(
              (fp.config.maxTime).getHours(),
              (fp.config.maxTime).getMinutes(),
              (fp.config.maxTime).getSeconds()
            );
            const currentTime = calculateSecondsSinceMidnight(
              latest.getHours(),
              latest.getMinutes(),
              latest.getSeconds()
            );

            if (currentTime > maxBound && currentTime < minBound) {
              const result = parseSeconds(minBound);
              fp.setDate(
                new Date(latest.getTime()).setHours(result[0], result[1], result[2]),
                false
              );
            }
          } else {
            if (compareDates(latest, fp.config.maxTime, false) > 0) {
              fp.setDate(
                new Date(latest.getTime()).setHours(
                  (fp.config.maxTime).getHours(),
                  (fp.config.maxTime).getMinutes(),
                  (fp.config.maxTime).getSeconds(),
                  (fp.config.maxTime).getMilliseconds()
                ),
                false
              );
            } else if (compareDates(latest, fp.config.minTime, false) < 0) {
              fp.setDate(
                new Date(latest.getTime()).setHours(
                  (fp.config.minTime).getHours(),
                  (fp.config.minTime).getMinutes(),
                  (fp.config.minTime).getSeconds(),
                  (fp.config.minTime).getMilliseconds()
                ),
                false
              );
            }
          }
        } else {
          const newMinMax = state.defaults || {
            minTime: undefined,
            maxTime: undefined,
          };

          this.set(newMinMax);

          if (!latest) return;

          const { minTime, maxTime } = fp.config;

          if (minTime && compareTimes(latest, minTime) < 0) {
            fp.setDate(
              new Date(latest.getTime()).setHours(
                minTime.getHours(),
                minTime.getMinutes(),
                minTime.getSeconds(),
                minTime.getMilliseconds()
              ),
              false
            );
          } else if (maxTime && compareTimes(latest, maxTime) > 0) {
            fp.setDate(
              new Date(latest.getTime()).setHours(
                maxTime.getHours(),
                maxTime.getMinutes(),
                maxTime.getSeconds(),
                maxTime.getMilliseconds()
              )
            );
          }
          //
        }
      },
    };
  };
}

export default minMaxTimePlugin;
