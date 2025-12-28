

import { Button, Modal } from 'antd';
import { get } from 'lodash';
import { useEffect } from 'react';
import './index.less';
import React from 'react';

interface IProps {
  sureRead: Function;
  onCancle: Function;
  visible: boolean;
  articleData: any;
  [key: string]: any;
}
export default function ArticleModal({ sureRead, articleData, onCancle, visible, ...props }: IProps) {
  useEffect(() => {
    console.log({ articleData });
  }, [articleData]);

  function handleOk() {
    sureRead({ ...articleData, readingState: true });
    handleCancle();
  }
  function handleCancle() {
    onCancle && onCancle('visible', false);
  }
  function footer() {
    return (
      <Button type="primary" onClick={handleOk} disabled={get(articleData, `readingState`) == '1' ? true : false}>
        确认已读
      </Button>
    );
  }
  return (
    <Modal
      title={get(articleData, `title`) || '阅读文章'}
      className="article-modal-container"
      width={600}
      style={{ top: '50px' }}
      visible={visible}
      footer={footer()}
      onCancel={handleCancle}
    >
      <div className="article-content" dangerouslySetInnerHTML={{ __html: get(articleData, `content`) }}></div>
    </Modal>
  );
}
