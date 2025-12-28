
import { DropDownProps, } from 'antd';
import { DropdownButtonProps } from 'antd/es/dropdown';

import React, { FC } from 'react';
const Inner = React.lazy(() => import('./Inner'));
const ButtonInner = React.lazy(() => import('./Button'));

const Dropdown_: FC<DropDownProps> = function Dropdown_(props: DropDownProps) {
    return <Inner {...props} />
}
function Button(props: DropdownButtonProps) {
    return <ButtonInner {...props} />
}

type DropdownType = typeof Dropdown_ & { Button: typeof Button };
export const Dropdown: DropdownType = Object.assign(Dropdown_, { Button: Button }) 
