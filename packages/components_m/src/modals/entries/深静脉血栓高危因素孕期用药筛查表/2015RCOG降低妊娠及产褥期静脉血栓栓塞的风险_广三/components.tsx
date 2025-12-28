import React from "react"
import { CheckboxWithValue, ICheckboxWithValueProps } from "../../../../FU_components"
export function Title({ title, extra }: { title: string, extra?: React.ReactNode }) {
  return <div style={{
    background: '#e6f7ff',
    padding: '2px 16px',
    borderBottom: '3px solid #6699ff',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8
  }}>
    <span>{title}</span>

    {
      extra ? extra : <span />
    }
  </div>
}
export function MyCheckbox(props: ICheckboxWithValueProps) {
  const { children, checkedValue } = props
  return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <CheckboxWithValue {...props} > {children} </CheckboxWithValue>
    <span style={{ padding: '0 24px' }}>{checkedValue}</span>
  </div>
}