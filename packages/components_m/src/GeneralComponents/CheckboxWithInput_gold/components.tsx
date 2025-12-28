import { pack_components } from '@lm_fe/components';
import { MyAutoComplete, MySelect } from '../../FU_components';
import { ArrayInput } from '../../FU_components/ArrayInput';
import DatePicker from '../DatePicker';
import MyInputNumber from '../InputNumber';
// import GeneralComponents_InputWithLabel from '../InputWithLabel';
import MultipleInputWithLabel from '../MultipleInputWithLabel';
export const components = {
  MultipleInputWithLabel,
  // InputWithLabel: GeneralComponents_InputWithLabel,
  DatePicker,
  CheckboxWithInput: '_',
  MyCheckbox: '_',
  MC: '_',
  Checkbox: '_',
  ArrayInput,
  MArr: ArrayInput,
  ...pack_components,
  MA: MyAutoComplete,
  MyAutoComplete,
  Select: MySelect,
  MySelect,
  MS: MySelect,
  InputNumber: MyInputNumber,
  MyInputNumber,
}


