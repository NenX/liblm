import { FC, lazy } from 'react';
import { DisplayFC } from './Display';
export { ICusDatePickerProps, UNKNOWN_TIME_SYMBOL } from './utils';
const _MyDatePicker = lazy(() => import('./Inner'))
type TMyDatePicker = typeof _MyDatePicker & { DisplayFC: FC<any> }

const MyDatePicker: TMyDatePicker = Object.assign(_MyDatePicker, { DisplayFC })

export { TMyDatePicker }

export default MyDatePicker 