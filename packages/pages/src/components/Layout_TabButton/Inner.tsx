import React, { useRef } from 'react';
import classnames from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
import styles from './index.module.less';

interface IProps {
  isActive?: boolean;
  title: string;
  tabKey: string;
  closable?: boolean;
  onClick?: any;
  onClose?: any;
}
export default function Layout_TabButton_Inner(props: IProps) {
  const { isActive = false, closable = true, title, onClick, onClose, tabKey } = props;

  const handleClickTab = () => {
    onClick && onClick(tabKey);
  };

  const handleCloseTab = (e: any) => {
    e.stopPropagation();
    onClose && onClose(tabKey);
  };

  return (
    <div id={tabKey} className={classnames(styles['my-tab-btn'], { [styles['my-tab-btn-active']]: isActive })} onClick={handleClickTab}>
      {/* <div className={classnames('my-tab-btn-icon', { 'my-tab-btn-icon-active': isActive })} /> */}
      <div title={title} className={styles['my-tab-btn-title']}>{title}</div>
      {closable && (
        <div onClick={handleCloseTab} className={styles['my-tab-btn-close']} title='关闭'>
          <CloseOutlined />
        </div>
      )}
    </div>
  );
};
