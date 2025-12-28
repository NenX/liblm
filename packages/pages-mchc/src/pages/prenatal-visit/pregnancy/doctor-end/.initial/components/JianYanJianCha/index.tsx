import { mchcUtils } from '@lm_fe/env';
import { DoctorEnd_检验检查_History } from '@lm_fe/pages';
import * as React from 'react';
import { IInitial_Tab_props } from '../../types';

export default function JianYanJianCha(props: IInitial_Tab_props) {
  const { form, active } = props
  const id = mchcUtils.getDoctorEndId()
  return active ? <DoctorEnd_检验检查_History form={form} pregnancyId={id} /> : null
}
Object.assign(JianYanJianCha, {
  Title: '检验检查',
  ClassName: 'yi-ban-bing-shi label-width6',
  tmp: true
})