
import { Modal } from 'antd';
import { get } from 'lodash';
import React from 'react';
import './index.less';
import ReserveList from './table-list';

interface IProps {
  onCancle: Function;
  visible: boolean;
  selectCourse: any;
  [key: string]: any;
}
export default function ReserveModal({ selectCourse, onCancle, visible, ...props }: IProps) {
  function handleCancle() {
    onCancle && onCancle();
  }
  return (
    <Modal
      title={'已预约列表'}
      className="reserve-modal-container"
      width={800}
      visible={visible}
      footer={null}
      onCancel={handleCancle}
    >
      <ReserveList id={get(selectCourse, 'id')}></ReserveList>
    </Modal>
  );
}
