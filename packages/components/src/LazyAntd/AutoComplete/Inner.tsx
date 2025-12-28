import Comp, { AutoCompleteProps } from 'antd/es/auto-complete';
import 'antd/es/auto-complete/style';
import React from 'react';

export default function LazyInner(props: AutoCompleteProps) {
    return <Comp {...props} />
}