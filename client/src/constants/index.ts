import type { TimeRangePickerProps } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
   dayjs.locale('zh-cn'); // 设置为中文本地化
// 日期选择器预设时间范围
export const RANGE_PRESETS: TimeRangePickerProps['presets'] = [
  { label: '今日', value: [dayjs().startOf('day'), dayjs()] },
  {
    label: '昨日',
    value: [
      dayjs().add(-1, 'd').startOf('day'),
      dayjs().add(-1, 'd').endOf('day'),
    ],
  },
  { label: '本周', value: [dayjs().startOf('week'), dayjs()] },
  { label: '本月', value: [dayjs().startOf('month'), dayjs()] },
  { label: '近7日', value: [dayjs().add(-6, 'd').startOf('day'), dayjs()] },
  { label: '近30日', value: [dayjs().add(-29, 'd').startOf('day'), dayjs()] },
];

// 分页大小选项
export const PageSizeOptions = ['10', '20', '50', '100'];
