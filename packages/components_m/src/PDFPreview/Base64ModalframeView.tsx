import React, { useState } from 'react';
import { request } from '@lm_fe/utils';
import { Modal, Button, Spin } from 'antd';
import styles from './View.module.less';

import { getMacroValue } from '@lm_fe/env';
interface Iprops {
  url: string;
  requestData: any;
  children: any;
  width?: string | number;
  size?: string;
  className?: string;
}

// 约定名称
// 见 /pdfjs/web/base64_viewer.html
const sessiongStoragePDFDataKey = '__BASE64_PDF_DATA__';
export default function Base64ModalIframeView({ url, requestData = {}, width = 856, className, children }: Iprops) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPDFData = async (): Promise<string> => {
    setLoading(true);
    const res = await request.post(url, requestData);
    setLoading(false);
    return res.pdfdata;
  };

  const openModal = async () => {
    await window.sessionStorage.setItem(sessiongStoragePDFDataKey, '');
    const pdfData = await getPDFData();
    await window.sessionStorage.setItem(sessiongStoragePDFDataKey, pdfData);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Spin spinning={loading}>
        <Button onClick={openModal}>{children}</Button>
        <Modal
          visible={visible}
          title="打印预览"
          width={width}
          footer={null}
          onCancel={handleCancel}
          wrapClassName={styles["pdf-modal-wrap"]}
          style={{ top: '20px' }}
          destroyOnClose
        >
          <iframe
            title="pdfView"
            width={width}
            src={`${getMacroValue('PUBLIC_PATH') ?? '/'}pdfjs/web/base64_viewer.html`}
            height="100%"
          />
        </Modal>
      </Spin>
    </>
  );
}
