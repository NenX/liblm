import { PrinterOutlined, SaveOutlined } from '@ant-design/icons';
import {
  BaseEditPanelFormFC,
  formatTimeToDate,

} from '@lm_fe/components_m';
import store from 'store'
import { IMchc_Doctor_OutpatientHeaderInfo, IMchc_OutpatientDocumentStatus, SLocal_History, SLocal_State, SMchc_Doctor } from '@lm_fe/service';
import { getSearchParamsValue } from '@lm_fe/utils';
import { Button, Form, FormInstance, Popconfirm, message } from 'antd';
import { get, map, set } from 'lodash';
import { isMoment } from '@lm_fe/utils';
import React, { useEffect, useState } from 'react';
import { form_config } from './form_config';
import { mchcModal__ } from '@lm_fe/pages';
function transformDate(pregnancyData: any) {
  map(pregnancyData, (value, key) => {
    if (isMoment(value)) {
      set(pregnancyData, key, formatTimeToDate(value));
    }
  });
  return pregnancyData;
}
interface IProps {
  isSingle?: boolean
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  form?: FormInstance

}
function ClosingArchives_Inner({ headerInfo, isSingle, form = Form.useForm()[0] }: IProps) {


  const [data, setData] = useState<IMchc_OutpatientDocumentStatus>()


  useEffect(() => {
    const id = headerInfo?.id ?? getSearchParamsValue('id')
    SMchc_Doctor.getOutpatientDocumentStatus(id).then(res => {
      res.referralOutInfo = res.referralOutInfo ?? {}
      res.referralOutInfo.recorder = res.referralOutInfo.recorder || SLocal_State.getUserData()?.firstName || ''
      form.setFieldsValue(res)
      setData(res)
    })

    return () => {

    }
  }, [])


  async function handlePrint() {
    const localData = store.get('localData');


    mchcModal__.open('print_modal', {
      modal_data: {
        requestData: {
          url: '/api/pdf-preview',
          resource: '',
          template: get(localData, `referralStyle`, 2),
          version: '',
          note: '',
          id: data?.referralOutInfo?.id
        }
      }
    })
  };


  function showPrint() {
    return (data?.referralOutInfo?.id && data.periodState === '5');
  }

  function renderPrintBtn() {

    return showPrint() ? (
      <Button
        type="primary"
        size="large"
        icon={<PrinterOutlined />}
        onClick={() => {
          handlePrint()
        }}
      >
        打印转诊单
      </Button>
    ) : null;
  };

  function renderSubmitBtn() {

    return data?.recordstate === '6' ? (
      <Popconfirm
        placement="topRight"
        title="你确定要结案吗？结案后将无法修改档案的任何信息，请谨慎操作！"
        onConfirm={handleFinish}
        okText="确定"
        cancelText="取消"
      >
        <Button size="large" type="primary" icon={<SaveOutlined />}>
          保存
        </Button>
      </Popconfirm>
    ) : (
      <Button
        size="large"
        type="primary"
        icon={<SaveOutlined />}
        htmlType="submit"
        onClick={handleFinish}
      >
        保存
      </Button>
    );
  };

  async function handleFinish() {
    form
      .validateFields()
      .then(async () => {
        const params: IMchc_OutpatientDocumentStatus = {
          ...form.getFieldsValue(),
          id: get(data, 'id'),
        };
        const newData = await SMchc_Doctor.updateOutpatientDocumentStatus(params);
        message.success(`修改成功`);
        setData(newData)
        if (get(params, 'recordstate') === '6' &&
          (isSingle || __DEV__)
        ) {
          if (confirm('此份档案已结案，是否需要新建档案？')) {
            SLocal_History.closeAndReplace(
              {
                pathname: '/single/add-archival',
                state: {
                  pregnancyData: headerInfo,
                  isSingle: isSingle,
                  location: get(history, 'location'),
                },
              }
            )
          }
        }



      })
      .catch((error) => {
        message.error(get(error, 'errorFields.0.errors.0'));
        form.scrollToField(get(error, 'errorFields.0.name.0'));
      });
  };





  // return <FormSectionForm form={form} formDescriptions={form_config()} onValuesChange={(a, b) => {
  //   console.log('onValuesChange', { a, b })
  // }} />
  return <BaseEditPanelFormFC form={form} formDescriptions={form_config()}
    renderBtns={form => {
      return <>
        {renderPrintBtn()}
        {renderSubmitBtn()}
      </>
    }}

  />

}
export default ClosingArchives_Inner
