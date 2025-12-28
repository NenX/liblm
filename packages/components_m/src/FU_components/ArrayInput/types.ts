import { AutoCompleteProps, InputNumberProps, InputProps } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { ICheckboxWithInputProps } from '../../GeneralComponents/CheckboxWithInput_gold';
import { ICusDatePickerProps } from '../../GeneralComponents/DatePicker';
import { IInputWithLabelProps } from '../../GeneralComponents/InputWithLabel';
import { IMultipleInputWithLabelProps } from '../../GeneralComponents/MultipleInputWithLabel';
import { MyAutoCompleteProps } from '../MyAutoComplete';
import { ICommonOption } from '@lm_fe/env';

import { IMySelectProps } from '../MySelect'
import { FocusEventHandler } from 'react';
import { IMyInputProps } from '@lm_fe/components';





export type TOption =
    { inputType: 'MyAutoComplete', props?: MyAutoCompleteProps } |
    { inputType: 'MA', props?: MyAutoCompleteProps } |
    { inputType: 'MySelect', props?: IMySelectProps } |
    { inputType: 'MS', props?: IMySelectProps } |
    { inputType: 'InputWithLabel', props?: IInputWithLabelProps } |
    { inputType: 'MultipleInputWithLabel', props?: IMultipleInputWithLabelProps } |
    { inputType: 'CusDatePicker', props?: ICusDatePickerProps } |
    { inputType: 'DatePicker', props?: ICusDatePickerProps } |
    { inputType: 'MyInput', props?: IMyInputProps } |
    { inputType: 'Input', props?: IMyInputProps } |
    { inputType: 'input', props?: IMyInputProps } |
    { inputType: 'CheckboxGroup', props?: CheckboxGroupProps } |
    { inputType: 'InputNumber', props?: InputNumberProps } |
    { inputType: 'input_number', props?: InputNumberProps } |
    { inputType: 'MyInputNumber', props?: InputNumberProps } |
    { inputType: 'CheckboxWithInput', props?: ICheckboxWithInputProps } |
    { inputType: 'MyCheckbox', props?: ICheckboxWithInputProps } |
    { inputType: 'MC', props?: ICheckboxWithInputProps } |
    { inputType: 'Checkbox', props?: ICheckboxWithInputProps }

export interface IArrayInputProps {
    autoFocus?: boolean
    disabled?: boolean
    inputWidth?: number,
    value?: string
    optionKey?: string
    onChange?(v: string | any[]): void
    separator?: string
    marshal?: number
    onBlur?: FocusEventHandler<any>,
    options?: (TOption & ICommonOption)[]
    sp?: (TOption & ICommonOption)[]
}