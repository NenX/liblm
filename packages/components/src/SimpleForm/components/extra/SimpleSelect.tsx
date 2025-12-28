import { SelectProps, Radio } from "antd"
import React from "react"
import { Select } from "src/LazyAntd/Select"


export default function SimpleSelect(props: SelectProps<any> & { optionsArr: string[], type?: 'Select' | 'Radio' }) {
    const { optionsArr, type = 'Select', ...others } = props
    if (type === 'Select') return <Select {...others} options={optionsArr.map((label, value) => ({ label, value }))} />
    //@ts-ignore
    return <Radio.Group {...others} options={optionsArr.map((label, value) => ({ label, value }))} />
}
