
import { ModalProps } from 'antd';

import React from 'react';
const Inner = React.lazy(() => import('./Inner'));

export function Modal(props: ModalProps) {
    return <Inner {...props}/>
}