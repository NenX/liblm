import {
    Checkbox,
    DatePicker,
    Divider,
    Input,
    InputNumber,
    Radio,
    Rate,
    Row,
    Slider,
    Switch,
    TimePicker,
    SelectProps,
} from 'antd'
import SimpleSelect from './extra/SimpleSelect'
import { MultiInput } from './extra/MultiInput'
// import HospitalTreeSelect from '@/demain-components/HospitalTreeSelect';
import Custom from './extra/Custom'
import SwitchSelect from './extra/SwitchSelect'
import { RangePickerProps } from 'antd/lib/date-picker'
import { ComponentClass } from 'react'
import TabForm from './TabForm'
import { LazyAntd } from 'src/LazyAntd'

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


const { RangePicker } = DatePicker
export interface IC {
    Input: typeof Input
    Select: typeof Select
    Radio: typeof Radio
    InputNumber: typeof InputNumber
    Checkbox: typeof Checkbox
    TimePicker: typeof TimePicker
    DatePicker: typeof DatePicker
    Switch: typeof Switch
    Rate: typeof Rate
    Slider: typeof Slider
    Text: typeof Text
    Divider: typeof Divider
    SimpleSelect: typeof SimpleSelect
    SwitchSelect: typeof SwitchSelect
    Custom: typeof Custom
    TabForm: typeof TabForm
    MultiInput: typeof MultiInput
    RangePicker: ComponentClass<RangePickerProps, any>
    Color: typeof Input
    TextArea: typeof Input.TextArea
    CheckboxGroup: typeof Checkbox.Group
    Grid: typeof Row
}
export const ComponentMapping: IC = {
    Input,
    Select,
    Radio,
    InputNumber,
    Checkbox,
    TimePicker,
    DatePicker,
    Switch,
    Rate,
    Slider,
    Color: Input,
    TextArea: Input.TextArea,
    CheckboxGroup: Checkbox.Group,
    Grid: Row,
    Text,
    Divider,
    // HospitalTreeSelect,
    SwitchSelect,
    SimpleSelect,
    Custom,
    TabForm,
    MultiInput,
    RangePicker,
}
