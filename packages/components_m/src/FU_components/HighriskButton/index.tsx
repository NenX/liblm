import { Button, ButtonProps } from 'antd';
import React from 'react';
import { IMchc_Doctor_OutpatientHeaderInfo } from "@lm_fe/service";
import { mchcModal } from '../../modals';
interface IValue {
  highriskGrade: string
  highriskNote: string
  infectionNote: string
}
interface IProps {
  value?: IValue | string
  onChange?(v: IValue | string): void
  marshal?: boolean
  text?: string
  buttonProps?: ButtonProps
}
export function HighriskButton(props: IProps) {
  const { value, onChange, marshal, text = '编辑', buttonProps = {} } = props

  function handleBtnClick() {

    mchcModal.open('高危因素管理', {
      modal_data: {
        pregnancyId: (value as any)?.id,
        data: value as any,
        onFinish: handleSave,
      }
    })
  };



  async function handleSave(data: IMchc_Doctor_OutpatientHeaderInfo) {
    onChange?.(marshal ? JSON.stringify(data) : data as any)
  };

  return <Button {...buttonProps} onClick={handleBtnClick}>{text}</Button>

}

