// import { ILmFormItemConfigMixin } from "@/lmTypes"
import { DatePicker_L, LazyAntd, MyDatePicker, MyFormSection, RangePicker_L, TimePicker_L } from "@lm_fe/components_m";
import { ILmFormItemConfigMixin } from "@lm_fe/components_m/dist/FU_components/SimpleForm/types/lmTypes";
import { IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";
import { Form, FormInstance, Input, SelectProps, Space, Switch, TimePicker } from "antd";
import React from "react";
// import { ArrayInput } from "../ArrayInput";
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

// import { HospitalTreeSelect } from "../../demain-components/HospitalTreeSelect";
const m = {
    Input,
    Select,
    // HospitalTreeSelect,
    // ArrayInput: ArrayInput,
    RangePicker: RangePicker_L,
    DatePicker: DatePicker_L,
    MyDatePicker: MyDatePicker,
    TimePicker: TimePicker_L,
    Switch,
    SwitchSelect
}
export function MyBaseListRenderFormItem({ searchSchema, disabled }: { searchSchema: ILmFormItemConfigMixin[], disabled?: boolean }) {

    return (
        <Space>
            {
                searchSchema?.map((config) => {
                    const { type, innerOptions, outerOptions } = config
                    const C = m[type]
                    if (C) {
                        return <Form.Item style={{ margin: 0, }} {...outerOptions}><C disabled={disabled} allowClear placeholder="请选择" style={{ minWidth: 120 }} {...innerOptions} /></Form.Item>
                    }

                    return (
                        <Form.Item style={{ margin: 0, }}>{"type error " + config?.type}</Form.Item>
                    )
                }) || null
            }
        </Space>
    )
}
export function MyBaseListRenderFormSection({ config, disabled, form }: { config: IMchc_FormDescriptions_Field_Nullable[], disabled?: boolean, form?: FormInstance }) {

    return (
        <MyFormSection form={form} defaultOptions={{}} inline formDescriptions={config.map(_ => {
            if (!_) return _
            const props = _.inputProps ?? _.props ?? {}
            props.allowClear = true
            if (['Select', 'select', 'MySelect', 'MS', 'MA', 'input', 'MI', 'MyInput'].includes(_.inputType!) && !_.inputProps?.width) {
                props.width = 128
            }
            _.inputProps = props

            return _
        })} disableAll={disabled} />

    )
}
function SwitchSelect(props: SelectProps<any>) {
    const { value } = props
    return <Select {...props} value={typeof value === 'undefined' ? value : +value} options={['否', '是'].map((_, idx) => ({ label: _, value: idx }))} onChange={(a, b) => {
        props.onChange?.(typeof a === 'undefined' ? a : !!a, b)
    }} />
}