
import { PDFPreview_View } from '@lm_fe/components_m';

import { PrinterOutlined } from '@ant-design/icons';
import { IMchc_Admission_DocumentListItem, TIdTypeCompatible } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Button, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { mchcModal__ } from '../../modals';
export default function Right(props: { activeItem: Partial<IMchc_Admission_DocumentListItem<'mchc'>>, id: TIdTypeCompatible }) {
  const { activeItem, id } = props
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getData();
    setPdfUrl('')


  }, [activeItem]);


  // 获取婴儿喂哺记录单的base64数据用做pdf展示
  async function getData() {
    const requestData = {
      id,
      note: '',
      // resource: 'NoenateRecord',
      // template: 'InfantFeedingRecord',
      vmName: activeItem.code,
      version: '',
    };
    setLoading(true);
    const { pdfdata } = (await request.post('/api/Informed-consent-form/export-pdf', requestData, {})).data;
    const pdfurl: any = base64TopdfUrl(pdfdata);
    setLoading(false);
    setPdfUrl(pdfurl);

  }
  // base64数据转pdfUrl
  function base64TopdfUrl(code: any) {


    code = code.replace(/[\n\r]/g, '');
    var raw = window.atob(code);
    let rawLength = raw.length;
    //转换成pdf.js能直接解析的Uint8Array类型
    let uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    const blob = new Blob([uInt8Array], { type: 'application/pdf' }); //转成pdf类型
    const blobURL = window.URL.createObjectURL(blob);
    return blobURL;
  }

  return (
    <div style={{ height: '90%' }}>
      {loading ? <Spin className="spin" style={{ marginTop: 64 }} tip="资源加载中，请稍等..." /> : <PDFPreview_View file={pdfUrl} />}
      <div className="right-bottom-btns">


        <Button
          type="primary"
          size="large"
          icon={<PrinterOutlined />}
          onClick={() => {
            mchcModal__.open('print_modal', {
              modal_data: {
                requestData: {
                  url: '/api/Informed-consent-form/export-pdf',
                  id: props.id,
                  vmName: activeItem.code,
                }
              }
            })
          }}
        >
          打印.
        </Button>
      </div>
    </div>
  );
}
