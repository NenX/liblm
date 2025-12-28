import { Dayjs } from 'dayjs';


import { RangePickerProps as RangePickerProps_, PickerTimeProps as PickerTimeProps_, PickerDateProps as PickerDateProps_, PickerProps as PickerProps_, } from 'antd/es/date-picker/generatePicker';
import { CalendarProps as CalendarProps_ } from 'antd/es/calendar/generateCalendar';



export type CalendarProps = CalendarProps_<Dayjs>
export type DatePickerProps = PickerProps_<Dayjs>

export type RangePickerProps = RangePickerProps_<Dayjs>

export interface TimePickerProps extends Omit<PickerTimeProps_<Dayjs>, 'picker'> { }

export interface WeekPickerProps extends Omit<PickerDateProps_<Dayjs>, "picker"> { }
export interface MonthPickerProps extends Omit<PickerDateProps_<Dayjs>, "picker"> { }
export interface YearPickerProps extends Omit<PickerDateProps_<Dayjs>, "picker"> { }


