import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

/**
 * 整理日期格式
 * @param date 日期对象
 * @param format 目标格式 YYYY-MM-DD hh:mm:ss
 * @returns {string}
 */
export const formatDate = (date: Dayjs | number, format?: string) => {
  if (date === undefined) return;

  return dayjs(date).format(format || 'YYYY-MM-DD HH:mm:ss');
};
  // 禁用未来日期和1个月前的日期
 export const disabledDate = (current: any) => {
    if (!current) {
      return false;
    }
    // 禁用未来日期
    const isAfterToday = current.isAfter(dayjs(), 'day');
    // 禁用1个月前的日期
    const isBeforeOneMonthAgo = current.isBefore(dayjs().add(-30, 'd'), 'day');
    return isAfterToday || isBeforeOneMonthAgo;
  };
