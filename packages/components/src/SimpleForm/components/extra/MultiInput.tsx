import { SelectProps, Radio } from "antd"
import React from "react"
import { LazyAntd } from "src/LazyAntd"

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


export function MultiInput(props: Omit<SelectProps<any>, 'value'> & { optionsArr: string[], value: string }) {
    const { optionsArr, value = "", onChange, ...others } = props
    const _value = value ? value.split(',').filter(_ => _) : []
    return <Select mode="tags" value={_value} onChange={v => onChange?.call(null, v.join(','), [])} {...others} />
}
