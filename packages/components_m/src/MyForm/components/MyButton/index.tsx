import React from 'react';
import { Button, Radio } from 'antd';

/*
 * 简单的渲染一个button 点击时dispatch
 * 无value，属于一个功能性的组件
 * click通过formItem提交一个change事件到外部
 */
interface MyButtonProps {
  dispatch: Function;
  input_props: any;
  disabled?:boolean

  onClick: Function;
}
export default function MyButton(props: MyButtonProps) {
  const handleClick = (item: string) => {
    props.onClick(item);
  };

  const buttons = props.input_props['btn_text'] || [];
  return (
    <Radio.Group disabled={props.disabled} value={''}>
      {buttons.map((item: any) => (
        <Radio.Button onClick={() => handleClick(item)}>{item}</Radio.Button>
      ))}
    </Radio.Group>
  );
}
