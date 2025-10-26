/**
 * 格式化美元单位
 * @param value
 * @returns
 */
export const formatDollarValue = (value: number) => {
  if ([null, undefined, ''].includes(value as any)) {
    return '-';
  }

  if (value === 0) {
    return '$0.00';
  }

  const result = Number((+value).toFixed(2));

  if (result >= 0) {
    if (Number.isInteger(result)) {
      return '$' + result + '.00';
    } else {
      return '$' + result;
    }
  } else {
    if (Number.isInteger(result)) {
      return '-$' + Math.abs(result) + '.00';
    } else {
      return '-$' + Math.abs(result);
    }
  }
};
