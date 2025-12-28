import * as React from 'react';
import { FormSection, FormSectionForm } from '@lm_fe/components_m';
import getConfig from './config';
import { 孕产史_config } from '../../../../nurse-end/archival-information/form/孕产史';
import { IInitial_Tab_props } from '../../types'
import { SMchc_Doctor } from '@lm_fe/service';
import { useEffect } from 'react';
import { mchcEvent, mchcUtils } from '@lm_fe/env';

export default function JWS(props: IInitial_Tab_props) {
  const { active, form } = props
  const config = 孕产史_config()
  const pregnancyId = mchcUtils.getDoctorEndId()


  useEffect(() => {

    if (active) {
      SMchc_Doctor.getPregnacymh(pregnancyId)
        .then(v => {
          form.setFieldsValue(v)
        })
    }


    return () => { }
  }, [active])


  return <FormSectionForm
    onValuesChange={(changedValues) => {


    }}
    onFinish={(v) => {
      SMchc_Doctor.updatePregnacymh(v).then(() => {
        mchcEvent.emit('outpatient', {
          type: '刷新头部',
          pregnancyId
        })
      })
    }}
    formDescriptions={[...config.children!, { name: 'id', form_hidden: true }]} form={form} />
}
Object.assign(JWS, {
  Title: '孕产史',
  Config: 孕产史_config().children,
  ClassName: 'yi-ban-bing-shi label-width6',
  tmp: true
})