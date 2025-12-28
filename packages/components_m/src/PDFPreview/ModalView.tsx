import React, { useState, lazy } from 'react';
import { Modal, Button } from 'antd';
const View = lazy(() => import('./View'))

import styles from './View.module.less';

interface IProps {
  file?: string;
  width?: string | number;
  children?: React.ReactNode;
}
function ModalView({ file, width = '210mm', children = '预览按钮' }: IProps) {
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
      <Button type="primary" onClick={showModal}>
        {children}
      </Button>
      <Modal
        centered
        destroyOnClose={true}
        title="预览"
        width={width}
        visible={visible}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={styles["pdf-modal-wrap"]}
      >
        <View file={file} />
      </Modal>
    </>
  );
}
export default ModalView;
