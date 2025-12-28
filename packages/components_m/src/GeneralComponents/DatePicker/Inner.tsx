import { DatePicker_L, MonthPicker_L, TimePicker_L } from '@lm_fe/components';
import { mchcLogger } from '@lm_fe/env';
import { Checkbox } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useCallback } from 'react';
import { TCommonComponent } from '../../FU_components/types';
import { getInputStyle } from '../../utils';
import { ICusDatePickerProps, UNKNOWN_TIME_SYMBOL, areEqual, formatProps, getIsUnknown, getUnknown, handleChangeValue } from './utils';
export { ICusDatePickerProps, UNKNOWN_TIME_SYMBOL } from './utils';
function CusDatePicker(_props: ICusDatePickerProps) {
  const props = formatProps(_props)
  const {
    value = undefined,
    onChange,
    valueType,
    minDate,
    maxDate,
    validDate,
    getPopupContainer,
    time_only,
    format,
    style,
    ...rest
  } = props
  const isUnknown = getIsUnknown(props)
  const _style = getInputStyle(props)



  const transValue = useCallback(
    (date?: any) => {
      let result = undefined;
      if (!!date) {
        result = dayjs(date, format);
      }
      return result;
    },
    [],
  )


  const handleChange = (date?: any, dateString?: string) => {
    mchcLogger.log('handleChange', date, dateString)
    const newValue = handleChangeValue(props, date)
    onChange?.(newValue);
  }

  const disabledDate = useCallback(
    (current: any) => {
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
      {
        props.time_only
          ? <TimePicker_L
            getPopupContainer={getPopupContainer}
            value={isUnknown ? null : transValue(value)}
            onChange={handleChange}
            disabledDate={disabledDate}
            format={format}
            {...rest}
            style={_style}
            placeholder={__DEV__ ? format : '请选择'}
          />
          : <DatePicker_L
            getPopupContainer={getPopupContainer}
            value={isUnknown ? null : transValue(value)}
            onChange={handleChange}
            disabledDate={disabledDate}
            format={format}

            {...rest}
            style={_style}
            placeholder={__DEV__ ? format + '+' : '请选择'}

          // disabled={isUnknown}

          />
      }
      {
        getUnknown(props) ? <span style={{ marginLeft: 6 }}>
          <Checkbox checked={isUnknown}
            skipGroup
            onChange={e => {
              const _value = e.target.checked ? UNKNOWN_TIME_SYMBOL : null

              const value = handleChangeValue(props, _value)

              onChange?.(value)

            }}
          />
          <span style={{ marginLeft: 6 }}>不详</span>
        </span> : null
      }
    </span>
  );
}
const df = memo<ICusDatePickerProps>(CusDatePicker, areEqual)
CusDatePicker.MonthPicker = MonthPicker_L;
const MyDatePickerInner: TCommonComponent<ICusDatePickerProps, string> = df

export default MyDatePickerInner 