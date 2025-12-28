import { lazy } from 'react';

export const DatePickerInner = lazy(() => import('./DatePicker').then(r => {
    return { "default": r.DatePicker }
}));

export const RangePickerInner = lazy(() => import('./DatePicker').then(r => {
    return { "default": r.DatePicker.RangePicker }
}));


export const MonthPickerInner = lazy(() => import('./DatePicker').then(r => {
    return { "default": r.DatePicker.MonthPicker }
}));

export const TimePickerInner = lazy(() => import('./DatePicker').then(r => {
    return { "default": r.DatePicker.TimePicker }
}));

export const CalendarInner = lazy(() => import('./Calendar'));


