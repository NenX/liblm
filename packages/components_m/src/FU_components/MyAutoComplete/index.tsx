import React, { lazy } from 'react';
import { MyAutoCompleteProps } from './types';
const MyAutoCompleteInner = lazy(() => import('./MyAutoCompleteInner'))
export { MyAutoCompleteProps } from './types';

export function MyAutoComplete(props: MyAutoCompleteProps) {
    return <MyAutoCompleteInner {...props} />
}