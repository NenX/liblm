import { BaseEditPanelFormFC } from '@lm_fe/components_m';
import { BF_Wrap2, mchcModal__ } from '@lm_fe/pages';
import { SFubao_BreastCancerScreening } from '@lm_fe/service';
import { Button, Form } from 'antd';
import { get, set } from 'lodash';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { form_config } from './form_config';
import { request } from '@lm_fe/utils';
export default function Form_乳腺癌筛查(props: { activeItem: any, id: any, onRefresh?: (a: any, b: any, c?: any) => void }) {
  const { onRefresh, id, activeItem } = props

  const [data, setdata] = useState<any>({})

  const { config, Wrap } = BF_Wrap2({ default_conf: { title: '两癌筛查-乳腺癌筛查', tableColumns: form_config } })

  const [form] = Form.useForm()


  const active_id = get(activeItem, 'id');
  const active_screen_id = get(activeItem, 'breastCancerScreeningId');


  useEffect(() => {
    handleInit();
    return () => { }
  }, [activeItem])


  async function handleInit() {
    const { basicInfo, basicData, siderPanels, system } = props as any;
    form.resetFields()

    let values = {} as any;
    if (active_screen_id && active_screen_id != -1) {
      values = await SFubao_BreastCancerScreening.getOne(active_screen_id)

    } else {
      set(values, 'womenHealthcareMenstrualHistory', { ...get(basicData, 'womenHealthcareMenstrualHistory') }); //同步档案月经史信息
    }



    // }
    if (!get(values, 'breastCancerDiagnosisAndGuidance.checkUnit'))
      set(values, 'breastCancerDiagnosisAndGuidance.checkUnit', get(system, 'config.hospitalName'));
    if (!get(values, 'breastCancerDiagnosisAndGuidance.checkDate'))
      set(values, 'breastCancerDiagnosisAndGuidance.checkDate', dayjs(new Date()));
    if (!get(values, 'breastCancerDiagnosisAndGuidance.checkDoctor'))
      set(values, 'breastCancerDiagnosisAndGuidance.checkDoctor', get(basicInfo, 'firstName'));

    setdata(values)
    form.setFieldsValue(values)
  };

  async function handleSubmit(values: any) {


    let params: any = values

    if (get(data, 'id')) {
      // 修改
      params = {
        ...data,
        ...params,
        screeningType: '乳腺癌筛查',
      };
      await SFubao_BreastCancerScreening.new_put(params)
      // const res = (await request.put('/api/two/cancer/screening/updateBreastCancerScreening', params)).data;

      onRefresh && onRefresh('Screening', activeItem);
    } else {
      //新增
      params = {
        breastCancerScreening: {
          ...params,
          screeningType: '乳腺癌筛查',
        },
        twoCancerScreeningId: Number(id),
      };
      // const res = (await request.post(baseUrl, params)).data
      await SFubao_BreastCancerScreening.new_post(params)

      onRefresh && onRefresh('Screening', activeItem, true);
    }
  };
  return <Wrap>
    <BaseEditPanelFormFC form={form} formDescriptions={config?.tableColumns}

      renderExtraBtns={form => {
        return <Button size='large' onClick={() => {
          request.post('/api/dataReport/reportBreastCancerRecord', { ids: [active_id], },);

        }}>上报</Button>
      }}
      onPrint={() => {
        mchcModal__.open('print_modal', {
          modal_data: {
            requestData: {
              url: '/api/two/cancer/screening/printBreastCancerScreening',
              id: data?.id
            }
          }
        })
      }}
      onFinish={async (v) => {
        return handleSubmit(v)
      }}
    />
  </Wrap>
}
