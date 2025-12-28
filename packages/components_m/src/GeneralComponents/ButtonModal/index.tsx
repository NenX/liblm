import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import './index.less';
interface IProps extends ModalProps {
  title?: string;
  type?: string;
  children?: React.ReactNode;
}
function ButtonWithModal({ title = '标题', type, children, ...rest }: IProps) {
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
        {title}
      </Button>
      <Modal
        centered
        destroyOnClose={true}
        width={360}
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="button-modal-wrap"
        {...rest}
      >
        {children}
      </Modal>
    </>
  );
}
export default ButtonWithModal;
