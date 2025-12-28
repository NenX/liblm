import { BaseEditPanelFormFC } from '@lm_fe/components_m';
import { getSearchParamsValue, fubaoRequest as request } from '@lm_fe/utils';
import { get, set } from 'lodash';

import { BF_Wrap2 } from '@lm_fe/pages';
import { TIdTypeCompatible } from '@lm_fe/service';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import form_config from '../../../premarital-care/.public-exam/SecondSex/form_config';
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
      title: `孕前检查-第二性征`,
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
            `/api/progestation/check/getByProgestationCheckArchivesId?progestationCheckArchivesId.equals=${id}&fileType.equals=2&childrenSign.equals=4`,
          )
        ).data
        : {};
    } else {
      res = id
        ? (
          await request.get(
            `/api/progestation/check/getByProgestationCheckArchivesId?progestationCheckArchivesId.equals=${id}&fileType.equals=1&childrenSign.equals=4`,
          )
        ).data
        : {};
    }
    if (res) {
      data = get(res, 'data.0');
      data = { ...data, ...get(data, 'progestationCheckArchivesSecondSexCharacterVM') };
      data = mchcUtils.autoNoteToCommonOption(data)
    }

    data = id ? data : {};


    setdata(data)
    form.setFieldsValue(data)
  };

  async function handleSubmit(values: any) {
    let { progestationCheckArchivesSecondSexCharacterVM } = data;
    const baseUrl = '/api/progestation/check/saveProgestationCheckArchivesSecondSexCharacter'
    let params = values;
    let progestationCheckArchivesDetailId = get(filesData, 'womanProgestationCheckArchivesDetailVM.id');
    if (type === 'husband') {
      progestationCheckArchivesDetailId = get(filesData, 'manProgestationCheckArchivesDetailVM.id');
    }

    params = {
      ...progestationCheckArchivesSecondSexCharacterVM,
      ...params,
      progestationCheckArchivesDetailId,
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
