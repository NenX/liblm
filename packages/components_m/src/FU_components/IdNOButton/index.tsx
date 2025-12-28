import { DisconnectOutlined, DownOutlined, ScanOutlined, UploadOutlined } from '@ant-design/icons';
import { LazyAntd, useMchcDriverStatus } from '@lm_fe/components';
import { mchcDriver, mchcEnv, mchcLogger } from '@lm_fe/env';
import { T_ReadCard_Msg } from '@lm_fe/env';
import { SLocal_State } from '@lm_fe/service';
import { Button, ButtonProps, Menu, Space } from 'antd';
import React, { useEffect, useState } from 'react';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export interface IIdNOButtonButtonProps extends ButtonProps {
  isShowQrCode?: false
  send_id?: string
}

const readType = {
  身份证: 'ReadCard',
  二维码: 'QRScan',
}
type Type = keyof typeof readType
const types = Object.keys(readType) as Type[]
export function IdNOButton(props: IIdNOButtonButtonProps) {
  const { send_id } = props
  const [target, setTarget] = useState(types[0])
  const { isOpen } = useMchcDriverStatus()

  const menuProps = <Menu onClick={e => { }}>
    {
      types.map(k => {
        return <Menu.Item
          onClick={() => {
            setTarget(k)
            send_msg(k)
          }}
          key={k}>读取{k}</Menu.Item>
      })
    }
  </Menu>
  function send_msg(type: Type) {
    const command = {
      name: readType[type],
      data: {},
      send_id
    };
    return mchcDriver.send(command)
  }

  return (
    <Dropdown.Button disabled={!__DEV__ && !isOpen}
      style={{ color: isOpen ? undefined : 'red' }}
      type={isOpen ? 'primary' : undefined}
      icon={< DownOutlined />}
      overlay={menuProps}
      onClick={e => send_msg(target)}
    >
      <Space>
        {
          isOpen ? <ScanOutlined /> : <DisconnectOutlined style={{ color: 'red' }} />
        }
        <span>读取{target}</span>
      </Space>
    </Dropdown.Button >
  );
}
export function SnapButton(props: IIdNOButtonButtonProps) {

  const { isOpen } = useMchcDriverStatus()


  function readSnap() {

    const command = {
      command: 'Snap',
      data: {
        pid: 0, // 患者id
        uid: SLocal_State.userData.login, // 操作id
      },
      token: mchcEnv.token!,
    };
    mchcLogger.log('=======', JSON.stringify(command));
    return mchcDriver.send(command)
  }

  return (
    <Button
      type="primary"
      icon={<UploadOutlined />}
      disabled={!isOpen}
      onClick={readSnap}
    >
      报告录入
    </Button>
  );
}
export function useReadIdNO() {
  const [id_NO_msg, setdata] = useState<T_ReadCard_Msg>()
  useEffect(() => {

    return mchcDriver.on_rm('data', e => {

      if (e.type === 'ReadCard') {
        setdata(e)
      }

    })
  }, [])
  return { id_NO_msg }
}