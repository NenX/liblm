import { RangePicker_L } from '@lm_fe/components';
import { getMomentRange } from '@lm_fe/utils';
import dayjs from 'dayjs';
import React, { memo, useCallback } from 'react';
import { getInputStyle } from 'src/utils';
import { TCommonComponent } from '../../FU_components/types';
import { IMyRangePickerProps, areEqual, formatProps, getIsUnknown, handleChangeValue } from './utils';
export { IMyRangePickerProps, UNKNOWN_TIME_SYMBOL } from './utils';
export function MyRangeDate(props: IMyRangePickerProps) {
  const { placeholder, ...rest } = props
  return (
    <MyRangePicker
      // ranges={getMomentRange(dayjs) as any}
      format="YYYY-MM-DD"
      style={{ width: 216 }}

      {...rest}

    />
  );
}
export function MyRangeDateTime(props: IMyRangePickerProps) {
  const { placeholder, ...rest } = props
  return (
    <MyRangePicker
      // ranges={getMomentRange(dayjs) as any}
      showTime={{
        defaultValue: [dayjs('00:00', 'HH:mm'), dayjs('23:59', 'HH:mm')],
      }}
      format="YYYY-MM-DD HH:mm"
      style={{ width: 282 }}
      {...rest}

    />
  );
}
function MyRangePickerInner(_props: IMyRangePickerProps) {
  const props = formatProps(_props)
  const {
    value = undefined,
    onChange,
    marshal,
    minDate,
    maxDate,
    validDate,
    getPopupContainer,
    showUnknown,
    format,
    style,
    ...rest
  } = props
  const isUnknown = getIsUnknown(props)

  const _style = getInputStyle(props)


  const transValue = useCallback(
    (arr: string[]) => {
      return arr.map(
        (date) => {
          let result = null;
          if (!!date) {
            result = dayjs(date);
          }
          return result;
        }
      ) as any
    },
    [],
  )


  const handleChange = (date: (any)[] | null, dateString?: string[]) => {
    date = date ?? []
    const { marshal } = props
    const _value = handleChangeValue(props, date)
    const __value = marshal ? JSON.stringify(_value) : _value

    onChange?.(__value);
  }

  const disabledDate = useCallback(
    (current: dayjs.Dayjs) => {
      const dateStr = dayjs(current).format('YYYY-MM-DD');
      if (validDate) {
        return dateStr.includes(validDate);
      }

      if (minDate) {
        if (minDate === 'now') {
          return current < dayjs().endOf('day');
        }
        return current < dayjs(minDate).endOf('day');
      }

      if (maxDate) {
        if (maxDate === 'now') {
          return current > dayjs().endOf('day');
        }
        return current > dayjs(maxDate).endOf('day');
      }
      return false;
    },
    [validDate, maxDate, minDate],
  )




  return (
    <span>
      <RangePicker_L
        style={_style}
        getPopupContainer={getPopupContainer}
        value={isUnknown ? undefined : transValue(value)}
        onChange={handleChange}
        disabledDate={disabledDate}
        format={format}
        {...rest}
        placeholder={['开始', '结束']}
      // disabled={isUnknown}

      />

    </span>
  );
}
const RangePicker_ = memo<IMyRangePickerProps>(MyRangePickerInner, areEqual)
export const MyRangePicker: TCommonComponent<IMyRangePickerProps, string> = RangePicker_
MyRangePicker.DisplayFC = (_props) => {
  const props = formatProps(_props)

  const { value } = props
  const isUnknown = getIsUnknown(props)


  return <span>
    {Array.isArray(value) ? value.join(',') : value}
  </span>
}