import { IdcardOutlined, QrcodeOutlined } from '@ant-design/icons';
import { mchcDriver } from '@lm_fe/env';
import { Button, ButtonProps, Divider, message } from 'antd';
import React, { useEffect } from 'react';
import { OkButton } from '../OkButton';

export interface IIdNOButtonButtonProps extends ButtonProps {
  isShowQrCode?: false
}

export function IdNOButton(props: IIdNOButtonButtonProps) {


  function send_msg(type: string) {
    const command = {
      name: type,
      data: {},
    };
    return mchcDriver.send(command)
  }

  return (
    <Button.Group>
      <OkButton primary text='读取身份证' {...props} icon={<IdcardOutlined />} onClick={() => send_msg('ReadCard')} />
      <Divider type='vertical' />
      <OkButton primary text='读取二维码' {...props} icon={<QrcodeOutlined />} onClick={() => send_msg('QRScan')} />
    </Button.Group>
  );
}
