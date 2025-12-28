import { ExclamationCircleOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { useMchcDriverStatus } from '@lm_fe/components';
import { mchcDriver } from '@lm_fe/env';
import { getChromeVersion, protocolCheck } from '@lm_fe/utils';
import { Badge, Button, ButtonProps, Modal, Tooltip, message } from 'antd';
import React, { useEffect } from 'react';
import { mchcModal } from 'src/modals';


const programName = 'OBIS外设驱动'
const downloadTip = `检测到您的电脑${programName}未安装或未打开，请下载并手动打开`

function download() {
  mchcDriver.download()
}
export default function MchcDriverStatus_Inner(props: ButtonProps & { btnText?: string }) {
  const { isOpen } = useMchcDriverStatus()

  useEffect(() => {

    // protocolCheck('lmcs://',
    //   function () { message.info('测试失败') },
    //   function () { message.info('测试成功') },
    //   function () { message.info('测试不支持') },
    // )
    return () => {

    }
  }, [])

  function tip() {
    Modal.confirm({
      title: '未安装插件',
      icon: <ExclamationCircleOutlined />,
      content: downloadTip,
      onOk() {
        console.log('下载');
        download()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  function try_open() {
    protocolCheck('lmcs://', function failCb() {
      tip()
    });
  }
  function onConnectSocket() {
    if (isOpen) {
      message.success(`${programName}已经启动！`)
      return
    }

    const chromeVersion = getChromeVersion();
    if (chromeVersion && chromeVersion > 84) {

      try_open()


    } else {
      message.warning('当前浏览器内核版本较低！')

      mchcModal.open('test', {
        modal_data: {
          content: <div>
            <h1> {downloadTip}</h1>
            <Button onClick={() => download()}>下载</Button>
          </div>
        }
      })
    }

  }
  return (
    <div
      id="socket-state-x"
      style={{ lineHeight: '20px', verticalAlign: 'middle', cursor: 'pointer' }}
      onClick={() => onConnectSocket()}
    >
      <Tooltip
        placement="topRight"
        // getPopupContainer={() => document.getElementById('socket-state')}
        // title={`socket 连接状态 -- ${WEBSOCKET_STATUS_TEXT[socketState]}`}
        title={
          <div>
            OBIS外设驱动
            {isOpen ? '已打开' : '未打开'}
          </div>
        }
      >
        <Badge dot status={isOpen ? 'success' : 'error'}>
          <NodeIndexOutlined style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }} />
        </Badge>
      </Tooltip>
    </div>
  );
}
