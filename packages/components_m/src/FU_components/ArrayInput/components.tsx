import { Checkbox } from 'antd';
import { MySelect } from '../../FU_components/MySelect';
import CusDatePicker from '../../GeneralComponents/DatePicker';
import MyInputNumber from '../../GeneralComponents/InputNumber';
import GeneralComponents_InputWithLabel from '../../GeneralComponents/InputWithLabel';
import MultipleInputWithLabel from '../../GeneralComponents/MultipleInputWithLabel';
import { MyAutoComplete } from '../MyAutoComplete';
import { TOption } from './types';

import { pack_components } from '@lm_fe/components';
import { default as MyCheckbox, MyCheckbox_Display } from '../../GeneralComponents/CheckboxWithInput_gold';
import { AnyObject } from '@lm_fe/utils';
// import MyCheckbox from '../../GeneralComponents/CheckboxWithInput_gold';
// const MyCheckbox = lazy(() => import("../../GeneralComponents/CheckboxWithInput_gold"))
// const MyCheckbox_Display = lazy(() => import("../../GeneralComponents/CheckboxWithInput_gold/Display"))
export const componentMap: { [x in TOption['inputType']]: any } = {
    MyAutoComplete,
    MA: MyAutoComplete,
    InputWithLabel: GeneralComponents_InputWithLabel,
    MultipleInputWithLabel,
    CusDatePicker,
    DatePicker: CusDatePicker,
    ...pack_components,
    CheckboxGroup: Checkbox.Group,
    InputNumber: MyInputNumber,
    MyInputNumber,
    input_number: MyInputNumber,
    CheckboxWithInput: MyCheckbox,
    MyCheckbox,
    Checkbox: MyCheckbox,
    MC: MyCheckbox,
    MySelect,
    MS: MySelect,
}
export const displayComponentMap: AnyObject = {

    // CheckboxWithInput: MyCheckbox,
    MyCheckbox: MyCheckbox_Display,
}


