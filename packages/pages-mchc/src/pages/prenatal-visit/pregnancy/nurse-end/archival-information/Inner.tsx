import { BaseEditPanelFormFC } from '@lm_fe/components_m';
import { mchcDriver, mchcEnv, mchcEvent, mchcLogger, mchcUtils } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field_Nullable_Arr, IMchc_Nurse_OutpatientDocument, SLocal_History, SLocal_State, SMchc_Nurse, TIdTypeCompatible } from '@lm_fe/service';
import { formatDate, getSearchParamsValue, request } from '@lm_fe/utils';
import { Button, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { archivalInformation_onClose, archivalInformation_onPrint, archivalInformation_onValuesChange } from './utils';
// import { form_config } from './form/form_config';
import { BF_Wrap2 } from '@lm_fe/pages';
import { PartialAll } from '@lm_fe/utils';
import { get, set } from 'lodash';
import { load_form_config_nurse_end, preset_config } from './form_new/form_config';
import { Ws } from './Ws';

function Pregnancies(props: { id?: TIdTypeCompatible, toAdd?: boolean, toCheck?: boolean }) {
  const { id, toAdd, toCheck } = props
  const [form_config, setForm_config] = useState<IMchc_FormDescriptions_Field_Nullable_Arr>()
  const [formData, setFormData] = useState<PartialAll<IMchc_Nurse_OutpatientDocument>>({ pregnancyInfo: { validateDate: formatDate()! } })
  const [form] = Form.useForm()
  const [requiredKeys, setRequiredKeys] = useState<{ [x: string]: boolean }>({})
  const searchId = getSearchParamsValue('id')
  const _id = id ?? searchId
  const [loading, setLoading] = useState(false)
  const isUnCheck = !formData?.recordstate || formData.recordstate === '0';
  const { config, Wrap } = BF_Wrap2({
    default_conf: { tableColumns: load_form_config_nurse_end, title: '孕册管理-编辑' },
  })




  useEffect(() => {
    if (_id) {
      setTimeout(() => {
        SMchc_Nurse.getOutpatientDocument(_id)
          .then(remoteData => {
            if (!remoteData) return
            mchcLogger.log('Pregnancies remote', remoteData)
            const validateDate = remoteData?.pregnancyInfo?.validateDate
            set(remoteData, 'pregnancyInfo.validateDate', validateDate ?? formatDate())

            const idNO = remoteData?.baseInfo?.idNO
            const idType = remoteData?.baseInfo?.idType
            const checkData = mchcUtils.checkIdNo_new(idNO, idType)

            const dob = remoteData?.baseInfo?.dob
            const nationality = remoteData?.baseInfo?.nationality
            const nativeplace = remoteData?.baseInfo?.nativeplace
            const age = remoteData?.baseInfo?.age


            set(remoteData, 'baseInfo.dob', dob ?? checkData?.birth)
            set(remoteData, 'baseInfo.nationality', nationality ?? checkData?.nationality)
            set(remoteData, 'baseInfo.nativeplace', nativeplace ?? checkData?.province)
            set(remoteData, 'baseInfo.age', age ?? checkData?.age)

            set(remoteData, 'auditorName', (remoteData as any).auditorName ?? SLocal_State.userData?.login)

            setFormData(remoteData)
          })
      }, 1000);
    }

  }, [])
  const preset = preset_config()
  useEffect(() => {

    return mchcDriver.on_rm('data', e => {

      if (e.type === 'ReadCard') {
        let res = e.data
        const baseInfo: Partial<IMchc_Nurse_OutpatientDocument['baseInfo']> = {
          name: res.name,
          idNO: res.idNO,
          idType: res.idType,
          dob: res.dob,
          age: res.age,
          nationality: res.nationality,
          nativeplace: res.nativeplace,
          validateDate: formatDate()!,
        }
        setFormData({ baseInfo });
      }

    })

  }, [])
  useEffect(() => {

    form.setFieldsValue(formData)




    return () => {

    }
  }, [formData])

 

  function onValuesChange(changedValues: any, allValues: any) {
    preset?.handler(changedValues, allValues, form,)
    archivalInformation_onValuesChange(changedValues, allValues, form, obj => setRequiredKeys({ ...requiredKeys, ...obj }))
  }
  function onPrint() {
    if (formData?.id) {
      archivalInformation_onPrint(formData.id)
    }
  }

  async function onFinish(isContinue = false) {
    const recordstate = isContinue ? '0' : (isUnCheck ? '1' : formData.recordstate)
    setLoading(true)
    return form.validateFields()
      .then(async v => {
        mchcLogger.log('vvv', { v, formData })
        const fn = formData?.id ? SMchc_Nurse.updateOutpatientDocument : SMchc_Nurse.newOutpatientDocument
        const remoteData = await fn({ ...formData, ...v, recordstate })

        setLoading(false)

        message.success('操作成功！')

        if (isContinue) {
          form.resetFields()
        } else {

          const ok = (isUnCheck && toCheck) ? confirm('是否前往编辑孕册?') : false
          if (ok) {
            SLocal_History.closeAndReplace(`/prenatal-visit/pregnancy/nurse-end?id=${remoteData.id}`)
          }
          // setFormData(remoteData)
          mchcEvent.emit('outpatient', { type: '刷新头部', pregnancyId: remoteData.id })
        }
        if (mchcEnv.in(['郫都'])) {
          // 该功能是判断审核孕册时 立即上报的需求（by 郫都
          if (get(v, 'pregnancyInfo.reportNow') == '1') {
            request.post('/api/dataReport/reportPregnancy', {
              ids: [get(formData, 'id')],
            });
          }
        }
      })
      .catch((e) => {
        message.warning('请完善表单项！')
        mchcLogger.log('error', e)
        setLoading(false)
      })

  }
  return <>

    <Wrap style={{ background: '#fff', padding: 12, height: '100%', overflow: 'scroll' }}>

      <BaseEditPanelFormFC requiredKeys={requiredKeys} form={form} formDescriptions={config?.tableColumns}
        onValuesChange={onValuesChange}
        renderBtns={() => {
          return <>
            {
              _id ? <Button type="primary" size="large" onClick={onPrint}>
                打印
              </Button> : null
            }
            <Button loading={loading} type="primary" size="large" onClick={() => onFinish()}>
              {isUnCheck ? '保存并审核' : '保存'}
            </Button>
            {
              searchId ? null : <Button loading={loading} type="primary" size="large" onClick={() => onFinish(true)}>
                保存并继续添加孕册
              </Button>
            }
            <Button size="large" onClick={archivalInformation_onClose}>
              关闭
            </Button>
          </>
        }}

      />
    </Wrap >
    <Ws />

  </>
}
export default Pregnancies;
