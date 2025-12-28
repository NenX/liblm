import * as React from 'react';
import { DatePickerInner } from './Base';
import { DatePickerProps } from './Base/props';


const DatePicker_L = React.forwardRef<any, DatePickerProps>((props, ref) => {
  return <DatePickerInner {...props} ref={ref} />;
});

DatePicker_L.displayName = 'TimePicker';

export {
  DatePicker_L,
  DatePickerProps
};
