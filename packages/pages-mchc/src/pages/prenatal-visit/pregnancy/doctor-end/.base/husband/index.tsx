import { SaveOutlined } from '@ant-design/icons';
import {
  BaseEditPanelFormFC,
  formatTimeToDate
} from '@lm_fe/components_m';

import { IMchc_Doctor_OutpatientHeaderInfo, IMchc_HusbandBaseInfoOfOutpatient, SMchc_Doctor } from '@lm_fe/service';
import { getSearchParamsValue, isMoment } from '@lm_fe/utils';
import { Button, Form, message } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { get, map, set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { form_config } from './form_config';
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
export function HusbandInfo({ headerInfo, isSingle, form = Form.useForm()[0] }: IProps) {


  const [data, setData] = useState<IMchc_HusbandBaseInfoOfOutpatient>()


  useEffect(() => {
    const id = headerInfo?.id ?? getSearchParamsValue('id')
    SMchc_Doctor.getHusbandBaseInfoOfOutpatient(id).then(res => {

      form.setFieldsValue(res)
      setData(res)
    })

    return () => {

    }
  }, [])








  function renderSubmitBtn() {

    return (
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
        const params: IMchc_HusbandBaseInfoOfOutpatient = {
          ...form.getFieldsValue(),
          id: get(data, 'id'),
        };
        const newData = await SMchc_Doctor.updateHusbandBaseInfoOfOutpatient(params);
        message.success(`修改成功`);
        setData(newData)




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
        {renderSubmitBtn()}
      </>
    }}

  />

}
export default HusbandInfo



