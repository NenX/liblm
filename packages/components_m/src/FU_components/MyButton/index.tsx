import React from 'react';
import { Button, ButtonProps } from 'antd';
import { OkButton } from '../OkButton';
export default function MyButton(props: ButtonProps & { btnText?: string }) {

  return (
    <OkButton {...props}  >
      {props.btnText}
    </OkButton>
  );
}
