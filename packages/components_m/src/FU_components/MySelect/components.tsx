import { pack_components } from '@lm_fe/components';
import { AutoComplete, Checkbox, InputNumber } from 'antd';
import MyCheckbox from '../../GeneralComponents/CheckboxWithInput_gold';
import CusDatePicker from '../../GeneralComponents/DatePicker';
import GeneralComponents_InputWithLabel from '../../GeneralComponents/InputWithLabel';
import MultipleInputWithLabel from '../../GeneralComponents/MultipleInputWithLabel';
import { TOption } from './types';
export const componentMap: { [x in TOption['inputType']]: any } = {
    AutoComplete,
    InputWithLabel: GeneralComponents_InputWithLabel,
    MultipleInputWithLabel,
    CusDatePicker,
    DatePicker: CusDatePicker,
    ...pack_components,
    CheckboxGroup: Checkbox.Group,
    InputNumber,
    CheckboxWithInput: MyCheckbox
}



