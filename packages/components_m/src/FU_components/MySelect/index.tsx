import { lazy } from 'react';
import { IMySelectProps } from './types';
import { DisplayFC } from './Display';
export { IMySelectProps };
const Inner = lazy(() => import('./Inner'));

type IMySelect = typeof Inner & { DisplayFC: typeof DisplayFC }

export const MySelect: IMySelect = Object.assign(Inner, { DisplayFC })
