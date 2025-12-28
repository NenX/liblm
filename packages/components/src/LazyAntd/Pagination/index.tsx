
import { PaginationProps } from 'antd/es/pagination';

import React from 'react';
const Inner = React.lazy(() => import('./Inner'));

export function Pagination(props: PaginationProps) {
    return <Inner {...props} />
}

