import * as React from 'react';
import { MonthPickerInner } from './Base';
import { MonthPickerProps } from './Base/props';


const MonthPicker_L = React.forwardRef<any, MonthPickerProps>((props, ref) => {
  return <MonthPickerInner {...props} ref={ref} />;
});

MonthPicker_L.displayName = 'TimePicker';


export {
  MonthPicker_L,
  MonthPickerProps
};