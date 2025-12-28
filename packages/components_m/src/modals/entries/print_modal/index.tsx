import { IGlobalModalProps, IPdfFrameView_Props, LazyAntd, PdfFrameView, PdfFrameView_Version, get_PdfFrameView_version } from '@lm_fe/components';
import { lm_pdfjs_info } from '@lm_fe/static';
import { Modal, Space } from 'antd';
import React, { useState } from 'react';
import store from 'store';
import styles from './index.module.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd



const LAST_SELECT_VERSION_KEY = 'LAST_SELECT_VERSION_KEY'

export default function Print_Modal({ modal_data, width, close, onClose, bodyStyle = {}, ...others }: IGlobalModalProps<IPdfFrameView_Props>) {

  const { version, } = modal_data

  const initVersion: PdfFrameView_Version = version || store.get(LAST_SELECT_VERSION_KEY) || get_PdfFrameView_version()

  const [__version, set__version] = useState(initVersion)


  const w = width ?? "60vw"






  return (
    <Modal
      className={styles['print-modal']}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: 36 }}>
          <span onClick={() => { }}>打印预览</span>
          <Space>
            {
              version
                ? null
                : <Select size='small' style={{ width: 200 }} value={__version} onChange={v => {
                  set__version(v)
                  store.set(LAST_SELECT_VERSION_KEY, v)
                }}
                  options={Object.keys(lm_pdfjs_info.dirs).map(value => ({ value, label: value }))} />
            }
          </Space>
        </div>
      }
      width={w}
      footer={null}
      // style={{ top: '20px' }}
      centered
      destroyOnClose
      style={{ padding: 0 }}
      {...others}
      bodyStyle={{ height: '88vh', ...bodyStyle, padding: 0, }}

    >






      <PdfFrameView {...modal_data} version={__version} />


    </Modal >
  );

};