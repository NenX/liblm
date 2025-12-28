import { BaseEditPanelFormFC } from '@lm_fe/components_m';
import { getSearchParamsValue, fubaoRequest as request } from '@lm_fe/utils';
import { get, set } from 'lodash';

import { BF_Wrap2 } from '@lm_fe/pages';
import { TIdTypeCompatible } from '@lm_fe/service';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import form_config from './form_config';
import { mchcUtils } from '@lm_fe/env';
interface IProps {
  type: 'husband' | 'wife'
  id?: TIdTypeCompatible
  filesData?: any
}
export default function PhysicalExamination(props: IProps) {
  const { type, filesData } = props
  const [form] = Form.useForm()
  const [data, setdata] = useState<any>({})

  const { Wrap, config } = BF_Wrap2({
    default_conf: {
      title: `婚前检查-第二性征`,
      tableColumns: form_config
    }
  })
  useEffect(() => {

    handleInit();

    return () => {

    }
  }, [])


  async function handleInit() {
    const id = get(props, 'id') || getSearchParamsValue('id');
    let res: any;
    let data: any;

    if (type === 'wife') {
      res = id
        ? (
          await request.get(
            `/api/premarital/check/getByPremaritalCheckArchivesId?premaritalCheckArchivesId.equals=${id}&fileType.equals=2&childrenSign.equals=4`,
          )
        ).data
        : {};
    } else {
      res = id
        ? (
          await request.get(
            `/api/premarital/check/getByPremaritalCheckArchivesId?premaritalCheckArchivesId.equals=${id}&fileType.equals=1&childrenSign.equals=4`,
          )
        ).data
        : {};
    }
    if (res) {
      data = get(res, 'data.0');
      data = { ...data, ...get(data, 'premaritalCheckArchivesSecondSexCharacterVM') };
      data = mchcUtils.autoNoteToCommonOption(data)
    }

    data = id ? data : {};


    setdata(data)
    form.setFieldsValue(data)
  };

  async function handleSubmit(values: any) {
    let { premaritalCheckArchivesSecondSexCharacterVM } = data;
    const baseUrl = '/api/premarital/check/savePremaritalCheckArchivesSecondSexCharacter'
    let params = values;
    let premaritalCheckArchivesDetailId = get(filesData, 'womanPremaritalCheckArchivesDetailVM.id');
    if (type === 'husband') {
      premaritalCheckArchivesDetailId = get(filesData, 'manPremaritalCheckArchivesDetailVM.id');
    }

    params = {
      ...premaritalCheckArchivesSecondSexCharacterVM,
      ...params,
      premaritalCheckArchivesDetailId,
    };
    params = mchcUtils.autoCommonOptionToNote(params)
 
    const _re = (await request.post(baseUrl, params)).data
    const res = _re.data
    if (get(res, 'code') === 1) {

      let newData = get(res, 'data.0');
      setdata(newData)
    } else {

    }
  };
  return <Wrap>
    <BaseEditPanelFormFC
      form={form}
      onFinish={async v => {
        handleSubmit(v)
      }}
      formDescriptions={config?.tableColumns}
    />
  </Wrap>
}
