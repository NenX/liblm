

import React from 'react';

import { RangePickerInner } from './Base';
import { RangePickerProps } from './Base/props';
import { getMomentRange } from '@lm_fe/utils';




const RangePicker_L = React.forwardRef<any, RangePickerProps>((props, ref) => {
  return <RangePickerInner ranges={getMomentRange()}  {...props} ref={ref} />;
});

RangePicker_L.displayName = 'RangePicker';

export {
  RangePicker_L,
  RangePickerProps
};

