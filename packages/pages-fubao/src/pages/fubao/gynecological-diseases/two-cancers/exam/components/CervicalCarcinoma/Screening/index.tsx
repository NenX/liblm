import { BaseEditPanelFormFC } from '@lm_fe/components_m';
import { BF_Wrap2, mchcModal__ } from '@lm_fe/pages';
import { SFubao_BreastCancerScreening, SFubao_CervicalCancerScreening } from '@lm_fe/service';
import { Button, Form } from 'antd';
import { get, set } from 'lodash';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { form_config } from './form_config';
import { request } from '@lm_fe/utils';
export default function Form_宫颈癌筛查(props: { activeItem: any, id: any, onRefresh?: (a: any, b: any, c?: any) => void }) {
  const { onRefresh, id, activeItem } = props

  const [data, setdata] = useState<any>({})

  const { config, Wrap } = BF_Wrap2({ default_conf: { title: '两癌筛查-宫颈癌筛查', tableColumns: form_config } })

  const [form] = Form.useForm()

  const active_id = get(activeItem, 'id');
  const active_screen_id = get(activeItem, 'cervicalCancerScreeningId');



  useEffect(() => {
    handleInit();
    return () => { }
  }, [activeItem])


  async function handleInit() {
    const { basicInfo, basicData, siderPanels, system } = props as any;
    form.resetFields()
    let values = {};
    if (active_screen_id && active_screen_id != -1) {
      values = (

        await SFubao_CervicalCancerScreening.getOne(active_screen_id)
      );
    } else {
      set(values, 'womenHealthcareMenstrualHistory', { ...get(basicData, 'womenHealthcareMenstrualHistory') }); //同步档案月经史信息
    }

    if (!get(values, 'cervicalCancerDiagnosisAndGuidance.checkUnit'))
      set(values, 'cervicalCancerDiagnosisAndGuidance.checkUnit', get(system, 'config.hospitalName'));
    if (!get(values, 'cervicalCancerDiagnosisAndGuidance.checkDate'))
      set(values, 'cervicalCancerDiagnosisAndGuidance.checkDate', dayjs(new Date()));
    if (!get(values, 'cervicalCancerDiagnosisAndGuidance.checkDoctorName'))
      set(values, 'cervicalCancerDiagnosisAndGuidance.checkDoctorName', get(basicInfo, 'firstName'));

    setdata(values)
    form.setFieldsValue(values)
  };

  async function handleSubmit(values: any) {
    if (get(data, 'id')) {
      // 修改
      let params = {
        ...data,
        ...values,
        screeningType: '宫颈癌筛查',
      };
      const res = await SFubao_CervicalCancerScreening.postOrPut(params,);
      console.log('values', { values, data, params })

      onRefresh && onRefresh('Screening', activeItem);
    } else {
      //新增
      let params = {
        cervicalCancerScreening: {
          ...values,
          screeningType: '宫颈癌筛查',
        },
        twoCancerScreeningId: Number(id),
      };
      const res = (await SFubao_CervicalCancerScreening.postOrPut(params as any))
      console.log('values', { values, data, params })

      onRefresh && onRefresh('Screening', activeItem, true);
    }
  };
  return <Wrap>
    <BaseEditPanelFormFC
      // renderBtns={config?.}
      renderExtraBtns={form => {
        return <Button size='large' onClick={() => {
          request.post('/api/dataReport/reportCervicalCancerRecord', { ids: [active_id], },);

        }}>上报</Button>
      }}
      onPrint={() => {
        mchcModal__.open('print_modal', {
          modal_data: {
            requestData: {
              url: '/api/two/cancer/screening/printCervicalCancerScreening',
              id: data?.id
            }
          }
        })
      }}
      form={form} formDescriptions={config?.tableColumns}
      onFinish={async (v) => {
        return handleSubmit(v)
      }}
    />
  </Wrap>
}
