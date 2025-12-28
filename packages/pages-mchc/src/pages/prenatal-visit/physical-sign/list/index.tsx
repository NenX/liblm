import { BF_Wrap2, MyBaseList } from '@lm_fe/pages';
import { formatDate } from '@lm_fe/utils';
import { Form } from 'antd';
import React from 'react';
import { form_confg } from './bf_default';
import { getPregnancyByOutpatientNO } from './methods';
export default function Physical_sign_list(props: any) {

  const [search_form] = Form.useForm()
  const { config, Wrap } = BF_Wrap2({
    default_conf: {
      tableColumns: form_confg,
      title: '体征检查-列表',
      name: '/api/measures',
      searchConfig: [
        { inputType: 'input', name: 'outpatientNO', label: '就诊卡号' },
        { inputType: 'rangeDate', name: 'createDate', label: '体检日期' }
      ]
    },
  })

  return <Wrap>
    <MyBaseList
      tableColumns={config?.tableColumns}
      searchConfig={config?.searchConfig}
      name={config?.name}
      // {...config}
      searchForm={search_form}
      handleBeforePopup={function (values) {
        if (!values.createDate) {
          values.createDate = formatDate()
        }
        return values
      }}
      modalFormConfig={{
        modal_data: {
          // form: modal_form,
          async onValuesChange(changedValues, values, form) {
            if (changedValues.outpatientNO) {
              const outpatientNO = changedValues.outpatientNO;
              const pregnancy = await getPregnancyByOutpatientNO(outpatientNO);
              const tempData = {
                name: '',
                gestationalWeek: '',
              };
              if (pregnancy.length > 0) {
                tempData.name = pregnancy[0].name
                tempData.gestationalWeek = pregnancy[0].currentGestationalWeek
              }
              form.setFieldsValue({ ...tempData })
            }
          },
        }
      }}
    />
  </Wrap>
}