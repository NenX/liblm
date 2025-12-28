import * as React from 'react';
import { CalendarInner } from './Base';
import { CalendarProps } from './Base/props';


const Calendar_L = React.forwardRef<any, CalendarProps>((props, ref) => {
    return <CalendarInner {...props} />;
});

Calendar_L.displayName = 'TimePicker';

export {
    Calendar_L,
    CalendarProps
};
