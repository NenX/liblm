import { TIdTypeCompatible } from '@lm_fe/service';
import { lazy } from 'react';
export * from './types';
const MyCheckbox = lazy(() => import('./Inner'));
const MyCheckbox_Display = lazy(() => import('./Display'));

(MyCheckbox as any).DisplayFC = MyCheckbox_Display
export default MyCheckbox
export { MyCheckbox_Display }