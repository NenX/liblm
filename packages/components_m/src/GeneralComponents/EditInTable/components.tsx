import { Button, Form, Popconfirm } from "antd"
import { IEditInTable_Row_Append_Config } from "./utils"
import React, { useEffect, useState } from "react"
import { PlusOutlined } from "@ant-design/icons"
import { MyFormSectionForm } from "src/FU_components/FormSection/FormSectionForm"
import { LazyAntd, MyLazyComponent } from "@lm_fe/components"
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export function FFF(props: { arr: { recordTime: string, key: string }[], config: IEditInTable_Row_Append_Config, onSelect(values: any | any[]): void, hidden?: boolean, disabled?: boolean }) {
    const { config, onSelect, hidden, arr, disabled } = props
    const { fds, processDataAsync, btnProps = {}, popProps = {}, } = config
    if (hidden) return null

    const [form] = Form.useForm()
    return <Popconfirm

        {...popProps}
        onConfirm={async () => {
            let values = form.getFieldsValue()
            if (processDataAsync) {
                values = await processDataAsync(values, arr)
            }

            onSelect(values)
        }}
        title={
            <MyFormSectionForm form={form} formDescriptions={fds.map(_ => ({
                ..._, inputProps:
                    Object.assign({}, _?.inputProps, {
                        popupStyle: { zIndex: 9999 },
                        dropdownStyle: { zIndex: 9999 },
                    })
            }))} />
        }>
        <Button disabled={disabled} type='dashed' icon={<PlusOutlined />} size='small' {...btnProps}>{btnProps.children}</Button>
    </Popconfirm>
}

export function CalInputOutput(props: { arr: { recordTime: string, key: string }[], onSelect(key: string): void, hidden?: boolean }) {
    const { arr, onSelect, hidden } = props
    const [selectKey, setSelectKey] = useState('')
    if (hidden) return null
    return <Popconfirm
        icon={'日期：'}
        onConfirm={() => {
            selectKey && onSelect(selectKey)
        }}
        title={
            <div>
                <Select style={{ width: 140 }} value={selectKey} dropdownStyle={{ zIndex: 9999 }} options={arr.map(_ => ({ label: _.recordTime, value: _.key }))} onSelect={setSelectKey} />
            </div>
        }>
        <Button size='small'>计算出入量</Button>
    </Popconfirm>
}

export
    function PopconfirmComponent({ children, C, value, onChange, CProps, onBlur }: { C: any, CProps: any, children?: any, value?: any, onChange?: any, onBlur?: any }) {
    const [_value, set_value] = useState()
    useEffect(() => {


        set_value(value)
    }, [value])

    return <Popconfirm icon={null} placement="right"
        // trigger='hover'
        onVisibleChange={(v) => {

        }}
        overlayInnerStyle={{
            // background: '#eee', outline: '2px solid #333'
        }}
        style={{ zIndex: 999, }}
        overlayStyle={{ zIndex: 999, }}
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{ hidden: true }}
        title={
            <div style={{}}>
                <MyLazyComponent>
                    <C
                        // onBlur={() => {F
                        //   // onBlur(e)
                        //   message.info('blur')
                        //   onChange(_value)
                        // }}
                        {...CProps} value={_value} onChange={onChange} />
                </MyLazyComponent>

            </div>
        }>
        <div style={{ minHeight: 40 }}>
            {children}
        </div>
    </Popconfirm >
}
