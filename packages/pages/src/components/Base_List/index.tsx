import { lazy } from 'react';
export * from './types';
const MyBaseList = lazy(() => import('./_MyBaseList'))
export { MyBaseList }
