import { lazy } from 'react';
const a = lazy(() => import('./Inner'))
export const MyMonaco = a
