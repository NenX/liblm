import * as React from 'react';
import { TimePickerInner } from './Base';
import { TimePickerProps } from './Base/props';


const TimePicker_L = React.forwardRef<any, TimePickerProps>((props, ref) => {
  return <TimePickerInner {...props} ref={ref} />;
});

TimePicker_L.displayName = 'TimePicker';

export {
  TimePicker_L,
  TimePickerProps
};
