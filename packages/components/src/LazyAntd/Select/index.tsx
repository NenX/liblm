
import { SelectProps, } from 'antd';
import { OptionProps } from 'antd/lib/select';

import React from 'react';
const Inner = React.lazy(() => import('./Inner'));
const OptionInner = React.lazy(() => import('./OptionInner'));

function Select_<T extends Object = any>(props: SelectProps<T>) {
    return <Inner {...props} />
}
function SelectOption(props: OptionProps) {
    return <OptionInner {...props} />
}

type SelectType = typeof Select_ & { Option: typeof SelectOption };
export const Select: SelectType = Object.assign(Select_, { Option: SelectOption }) 
