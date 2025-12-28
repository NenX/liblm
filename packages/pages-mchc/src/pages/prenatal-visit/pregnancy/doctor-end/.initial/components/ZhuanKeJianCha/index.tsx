import { FormSectionForm } from '@lm_fe/components_m';
import { mchcUtils } from '@lm_fe/env';
import { BF_Wrap2 } from '@lm_fe/pages';
import { SMchc_Doctor } from '@lm_fe/service';
import { FormInstance } from 'antd';
import * as React from 'react';
import { useEffect } from 'react';
export default function ZhuanKeJianCha(props: { form: FormInstance, active: boolean }) {
  const { form, active } = props
  const id = mchcUtils.getDoctorEndId()
  const { Wrap, config } = BF_Wrap2({ default_conf: { tableColumns: () => import('./form_config'), title: '门诊-专科检查', } })
  useEffect(() => {
    if (active) {
      SMchc_Doctor.getGynecologicalExamOfOutpatient(id).then(v => {
        form.setFieldsValue(v)
      })
    }



    return () => {

    }
  }, [active])

  return <Wrap>
    <FormSectionForm
      onValuesChange={(changedValues) => {

      }}
      onFinish={(v) => {
        SMchc_Doctor.updateGynecologicalExamOfOutpatient(v)
      }}
      formDescriptions={config?.tableColumns} form={form} />
  </Wrap>
}
Object.assign(ZhuanKeJianCha, {
  Title: '专科检查',

  ClassName: 'yi-ban-bing-shi label-width6',
  tmp: true
})