import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import IframeView from './IframeView';
import styles from './View.module.less';

interface IProps {
  file?: string;
  width?: string | number;
  children?: React.ReactNode;
  className?: any;
  size?: string;
  type?: string;
}
function ModalIframeView({ file, width = '856px', children = '预览按钮', className, size, type }: IProps) {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button onClick={showModal} className={className} size={size} type={type}>
        {children}
      </Button>
      <Modal
        centered
        destroyOnClose={true}
        title="打印预览"
        width={width}
        visible={visible}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={styles["pdf-modal-wrap"]}
      >
        <IframeView file={file} />
      </Modal>
    </>
  );
}
export default ModalIframeView;
