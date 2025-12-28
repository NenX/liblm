import { DatePicker_L, LazyAntd, RangePicker_L, TimePicker_L } from '@lm_fe/components';
import { Checkbox, Divider, Form, Input, InputNumber, Radio, Rate, Row, Slider, Switch } from "antd";
import CusDatePicker from "../../../GeneralComponents/DatePicker";
import { GetProps } from "./help";

const { Tree, TreeSelect, Select, Table, Dropdown } = LazyAntd

export interface TypeMaps {
    Input: GetProps<typeof Input>,
    Select: GetProps<typeof Select>,
    Radio: GetProps<typeof Radio>,
    TextArea: GetProps<typeof Input.TextArea>,
    InputNumber: GetProps<typeof InputNumber>,
    Checkbox: GetProps<typeof Checkbox>,
    TimePicker: GetProps<typeof TimePicker_L>,
    DatePicker: GetProps<typeof DatePicker_L>,
    RangePicker: GetProps<typeof RangePicker_L>,
    MyDatePicker: GetProps<typeof CusDatePicker>,
    Switch: GetProps<typeof Switch>,
    Rate: GetProps<typeof Rate>,
    Slider: GetProps<typeof Slider>,
    Color: GetProps<typeof Input>,
    CheckboxGroup: GetProps<typeof Checkbox.Group>,
    Text: { value: string },
    Divider: GetProps<typeof Divider>,
    Grid: GetProps<typeof Row> & { list: ILmFormItemConfig<'Grid'> },
    HospitalTreeSelect: GetProps<typeof Tree> & { valueType?: 'string' | 'object' | 'normal' }
    SwitchSelect: GetProps<typeof Select>
}

type ILmFormItemOptionsUnion<T extends keyof TypeMaps> = {
    type: T,
    isLayout?: boolean
    innerOptions?: TypeMaps[T] & { value?: any, onChange?: any },
    outerOptions?: GetProps<typeof Form.Item>
    chosen?: boolean
    remote?: boolean
    readonly?: boolean,
    showLabel?: boolean
    remoteOptions?: any[],
    width?: number
    remoteFunc?: string
    onChangeFunc?: string
    id?: number
    icon?: string
    key?: string
    model?: string
    customClass?: string
}
export type ILmInput = ILmFormItemOptionsUnion<'Input'>
export type ILmSelect = ILmFormItemOptionsUnion<'Select'>
export type ILmRadio = ILmFormItemOptionsUnion<'Radio'>
export type ILmTextArea = ILmFormItemOptionsUnion<'TextArea'>
export type ILmInputNumber = ILmFormItemOptionsUnion<'InputNumber'>
export type ILmCheckbox = ILmFormItemOptionsUnion<'Checkbox'>
export type ILmTimePicker = ILmFormItemOptionsUnion<'TimePicker'>
export type ILmDatePicker = ILmFormItemOptionsUnion<'DatePicker'>
export type ILmMyDatePicker = ILmFormItemOptionsUnion<'MyDatePicker'>
export type ILmSwitch = ILmFormItemOptionsUnion<'Switch'>
export type ILmRate = ILmFormItemOptionsUnion<'Rate'>
export type ILmSlider = ILmFormItemOptionsUnion<'Slider'>
export type ILmColor = ILmFormItemOptionsUnion<'Color'>
export type ILmCheckboxGroup = ILmFormItemOptionsUnion<'CheckboxGroup'>
export type ILmText = ILmFormItemOptionsUnion<'Text'>
export type ILmDivider = ILmFormItemOptionsUnion<'Divider'>
export type ILmGrid = ILmFormItemOptionsUnion<'Grid'>
export type ILmHospitalTreeSelect = ILmFormItemOptionsUnion<'HospitalTreeSelect'>
export type ILmSelectProps = ILmFormItemOptionsUnion<'SwitchSelect'>
export type ILmFormItemConfig<T extends keyof TypeMaps> = ILmFormItemOptionsUnion<T>
export type ILmFormItemInnerOptionsg<T extends keyof TypeMaps> = ILmFormItemConfig<T>['innerOptions']
export type ILmFormItemOuterOptions<T extends keyof TypeMaps> = ILmFormItemConfig<T>['outerOptions']
export type ILmFormItemOmitOptions<T extends keyof TypeMaps> = Omit<ILmFormItemConfig<T>, 'innerOptions'> | Omit<ILmFormItemConfig<T>, 'outerOptions'>




export type ILmFormItemConfigMixin =
    ILmInput | ILmSelect | ILmRadio | ILmTextArea |
    ILmInputNumber | ILmCheckbox | ILmTimePicker |
    ILmDatePicker | ILmSwitch | ILmRate | ILmText |
    ILmSlider | ILmColor | ILmCheckboxGroup |
    ILmDivider | ILmGrid | ILmHospitalTreeSelect | ILmSelectProps | ILmMyDatePicker | ILmFormItemOptionsUnion<'RangePicker'>




