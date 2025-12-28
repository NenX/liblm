import { TIdTypeCompatible } from '@lm_fe/service';
import React from 'react';
import { TCommonComponentDisplay } from '../../FU_components/types';
import { ICheckboxWithInputProps } from './types';
import { displayValue, getMarshal, parse_MC_option, parseValue } from './utils';
import { ICommonOption } from '@lm_fe/env';
export * from './types';
interface IData { value: TIdTypeCompatible, label?: string, text?: string }
const MyCheckbox_DisplayFC: TCommonComponentDisplay<ICheckboxWithInputProps, string | number | ICommonOption[]> = props => {
    const { value, marshal, type = 'single', options, optionKey } = props



    const _options = parse_MC_option(props)
    const _marshal = getMarshal(props, value)

    const _value = parseValue(value, _marshal, type)



    return <span>{displayValue(_options, _value)}</span>
}
export default MyCheckbox_DisplayFC