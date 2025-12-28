import { LazyAntd, MonthPicker_L, pack_components, TimePicker_L } from '@lm_fe/components';
import { mchcLogger } from '@lm_fe/env';
import { AutoComplete, Checkbox, Radio } from 'antd';
import { get } from 'lodash';
import React, { useCallback } from 'react';
import { TakeInVolumn } from 'src/FU_components/TakeInVolumn';
import { TakeOutVolumn } from 'src/FU_components/TakeOutVolumn/index';
import { InterceptComponent } from 'src/utils/InterceptComponent';
import BloodPressure from '../BusinessComponents/BloodPressure';
import PressureInput from '../BusinessComponents/PressureInput';
import { TimePickerAutoaccept } from '../BusinessComponents/TimePickerAutoaccept';
import { CheckboxWithInput_lm as CheckboxWithInput } from '../ConfigComponents/CheckboxWithInput';
import DictionarySelectInTable from '../ConfigComponents/DictionarySelectInTable';
import MultipleInputWithLabel from '../ConfigComponents/MultipleInputWithLabel';
import PureCheckbox from '../ConfigComponents/PureCheckbox';
import { ArrayInput, CheckboxWithValue, FormTabs, HourMinuteInput, MyAutoComplete, MyEditTable, TemplateTextarea } from '../FU_components';
import ArrayPanel from '../FU_components/ArrayPanel/Inner';
import { DateTimeInput } from '../FU_components/DateTimeInput';
import { MySelect } from '../FU_components/MySelect';
import { MyPressure } from '../FU_components/PressureInput';
import MyCheckbox from '../GeneralComponents/CheckboxWithInput_gold';
import CustomTreeSelect from '../GeneralComponents/CustomTreeSelect';
import DatePicker from '../GeneralComponents/DatePicker';
import DictionarySelect from '../GeneralComponents/DictionarySelect';
import MyInputNumber from '../GeneralComponents/InputNumber';
import GeneralComponents_InputWithLabel from '../GeneralComponents/InputWithLabel';
import InputWithRange from '../GeneralComponents/InputWithRange';
import MyTreeSelect from '../MyForm/components/MyTreeSelect';
import DataSelectWithOptionsOrInput from '../selects/DataSelectWithOptionsOrInput';
import NormalSelect from '../selects/NormalSelect';
import PatientAutoComplete from '../selects/PatientAutoComplete';
import SelectTagWithOptions from '../selects/SelectTagWithOptions';
import SelectWithNo from '../selects/SelectWithNo';
import SelectWithOptionsFromApi from '../selects/SelectWithOptionsFromApi';
import SelectWithOptionsOrInput from '../selects/SelectWithOptionsOrInput';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const Radio_Group = Radio.Group
export const componentMap = {
  ...pack_components,
  FormTabs,
  'text_area': TemplateTextarea,
  TextArea: TemplateTextarea,
  InputNumber: MyInputNumber,
  TakeInVolumn,
  DateTimeInput,
  TakeOutVolumn,
  'patient_auto_complete': PatientAutoComplete,
  'input_with_label': GeneralComponents_InputWithLabel,
  'input_with_range': InputWithRange,
  'month_picker': MonthPicker_L,
  'single_date_picker': DatePicker,
  DatePicker,
  MyDatePicker: DatePicker,
  'single_time_picker': TimePicker_L,
  'date_picker_auto_accept': TimePickerAutoaccept,
  'checkbox': Checkbox,
  'CheckboxWithValue': CheckboxWithValue,
  MyCheckbox,
  MC: MyCheckbox,
  'dictionary_select': DictionarySelect,
  'pure_checkbox': PureCheckbox,
  'dictionary_select_in_table': DictionarySelectInTable,
  'radio_group': Radio_Group,
  'select': SelectTagWithOptions,
  'select_tag_with_options': SelectTagWithOptions,
  'normal_select': NormalSelect,
  'tree_select': MyTreeSelect,
  'tree_select_v2': CustomTreeSelect,
  'input_number': MyInputNumber,
  'select_with_no': SelectWithNo,
  'select_with_options': Select,
  'MA': MyAutoComplete,
  'MyAutoComplete': MyAutoComplete,
  'select_with_options_or_input': SelectWithOptionsOrInput,
  'data_select_with_options_or_input': DataSelectWithOptionsOrInput,
  'select_with_options_from_api': SelectWithOptionsFromApi,
  'pressure': PressureInput,
  'blood_pressure': BloodPressure,
  'MyPressure': MyPressure,
  'HourMinuteInput': HourMinuteInput,
  'auto_complete': AutoComplete,
  'checkbox_with_input': CheckboxWithInput,
  'template_textarea': TemplateTextarea,
  TemplateTextarea,
  MyTemplateTextarea: TemplateTextarea,
  'multiple_input_with_label': MultipleInputWithLabel,
  MySelect,
  Select: MySelect,
  MS: MySelect,
  ArrayInput,
  ArrayPanel,
  MyEditTable

}

export default function BaseFormComponent(props: any) {
  const { config, display, value } = props
  const type: 'Input' = get(props, 'inputType') || get(props, 'config.inputType');
  const inputProps = props.inputProps ?? {}
  const C = useCallback(
    componentMap[type] ?? (() => {
      mchcLogger.warn('Unkown Component', { componentMap, type })
      return `Unkown Component: ${type}!`
    }),
    [type],
  )
  if (display) {
    const DisplayFC: any = get(C, 'DisplayFC')
    return DisplayFC ? <InterceptComponent config={config} C={DisplayFC} {...props} {...inputProps} /> : (value || '')
  }
  return <InterceptComponent config={config} C={C} {...props} {...inputProps} />

};
