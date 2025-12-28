import { TableProps } from 'antd';
import React from 'react';
const Inner = React.lazy(() => import('./Inner'));

export function Table<T extends Object = any>(props: TableProps<T>) {
    return <Inner {...props} />
}