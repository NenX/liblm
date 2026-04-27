import { SaveOutlined, SyncOutlined } from '@ant-design/icons';
import { MyLazyComponent, OkButton, getBMI, useMyEffectSafe } from '@lm_fe/components_m';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitInfoOfOutpatient, IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit, IMchc_FormDescriptions_Field, SLocal_Calculator, TIdTypeCompatible, process_OutpatientDocument_physicalExam_local, process_OutpatientDocument_physicalExam_remote } from '@lm_fe/service';
import { copyText, getFutureDate, request } from '@lm_fe/utils';
import { Button, Card, Form, FormInstance, Modal, Space, message } from 'antd';
import { get, isEqual, size } from 'lodash';
import React, { useEffect, useState } from 'react';
import DiabetesAppointment from '../../../.components/DiabetesAppointment';
import PreventPreeclampsia from '../../../.components/PreventPreeclampsia';
import ResultImport from '../../../.components/ResultImport';

import { PlusOutlined } from '@ant-design/icons';
import { mchcConfig, mchcEnv, mchcEvent, mchcLogger, mchcUtils, mchcDriver } from '@lm_fe/env';
import { HighRiskTableEntry, mchcModal__ } from '@lm_fe/pages';
import { expect_array } from '@lm_fe/utils';
import FormBlock from './form_config/Form';
import styles from './index.module.less';
import classNames from 'classnames';
// 弹窗枚举
interface IProps {
  addon_btns?: (data?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>, refresh?: () => void) => React.ReactNode
  before_submit?: (submit: (values: any) => Promise<void>, data?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>, form?: FormInstance, sync?: Boolean) => Promise<void>
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo,
  visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient
  formData?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>,
  diagnosesList: IMchc_Doctor_Diagnoses[]
  isAllPregnancies: boolean

  changePreventPreeclampsia(v: boolean): void,

  onAddBtnClick(): void,
  isShowPreventPreeclampsia: boolean,

  getLastRecord(): void,
  getVisitsData(): Promise<void>,
  furtherRefresh(): void



  formChange(b: boolean): void
  canSave: boolean
  loading: boolean
  handleSubmit(values: any): Promise<void>


}
function FurtherForm(props: IProps) {

  const { getLastRecord } = props;
  const { formChange } = props;
  const {
    addon_btns,
    before_submit,
    diagnosesList,
    formData,
    visitsData,
    getVisitsData,
    isAllPregnancies,
    headerInfo,
    changePreventPreeclampsia,
    onAddBtnClick,
    isShowPreventPreeclampsia,
    canSave,
    handleSubmit,
    loading,
  } = props;
  const [isShowMenzhen, set_isShowMenzhen] = useState(false)
  const [isShowResultImport, set_isShowResultImport] = useState(false)

  const [form] = Form.useForm()

  const form_id = formData?.id
  const preg_id = mchcUtils.getDoctorEndId(headerInfo);


  // useEffect(() => {
  //   const rm = mchcEvent.on_rm('my_form', e => {
  //     console.log('load', { formData, e })
  //     if (e.type === 'onLoad' && formData) {
  //       formData.physicalExam = process_OutpatientDocument_physicalExam_remote(formData.physicalExam)
  //       form.setFieldsValue(formData)
  //     }
  //   })
  //   return rm
  // }, [formData])
  useEffect(() => {
    if (formData) {
      formData.physicalExam = process_OutpatientDocument_physicalExam_remote(formData.physicalExam)
      let fetusExam = expect_array(formData.fetusExam)
      formData.fetusExam = fetusExam.length ? fetusExam : [{}]

      form.setFieldsValue(formData)
    }
  }, [formData])



  useMyEffectSafe(props)(() => {
    const rm = mchcEvent.on_rm('my_form', async e => {
      // mchcEnv.logger.log('event receive', { e, })
      if (e.type === 'onChange') {
        formChange(true);

        const values = e.values;
        const value = e.value;
        const key = e.name
        if (key === 'visitDate') {
          const a = await SLocal_Calculator.calcGesWeek({ date: value, id: preg_id });
          e.setValue?.('gestationalWeek', a.gestationalWeek)
        }

        if (key === 'appointmentCycle') {
          e.setValue?.('appointmentDate', getFutureDate(value))
        }

        if (key === 'physicalExam') {
          const physicalExam = values?.physicalExam
          let bmi = getBMI(physicalExam?.weight, physicalExam?.height)
          form.setFieldsValue({ physicalExam: { bmi } })
        }

      }

      if (e.type === 'onClick') {

        if (e.btnName === 'inspection') {
          set_isShowResultImport(true)


        }

      }

      if (e.type === 'onFocus') {
        if (e.name === 'gestationalWeek') {
          mchcModal__.open('modal_form', {
            width: '20vw',
            bodyStyle: { height: '20vh' },

            modal_data: {
              async onSubmit(v) {
                const values = form.getFieldsValue()
                const visitDate = values.visitDate;
                const old_pre = values.prescription ?? ''

                const params = { sureEdd: v.edd, date: visitDate, id: preg_id };
                const { gestationalWeek } = await SLocal_Calculator.calcGesWeek(params);
                mchcEvent.emit('outpatient', { type: '刷新头部', pregnancyId: preg_id })
                let prescription = `${old_pre} ${old_pre ? '/' : ''} 预产期B超修订为 ${v.edd}`;
                form.setFieldsValue({ prescription, gestationalWeek })
                return 1
              },
              async getInitialData() {
                return headerInfo
              },
              formDescriptions: [{ label: '预产期-B超', name: 'edd', inputType: 'DatePicker' }] as IMchc_FormDescriptions_Field[]
            }
          })

        }
      }
    })
    return rm
  }, [])







  function setItemValue(val: string, key: string) {

  };


  function on_submit(sync: Boolean = true) {
    // sync 用于郫都 传false的时候单纯保存记录   不回写记录给HIS
    if (before_submit) {
      return before_submit(handleSubmit, formData, form, sync)
    }

    form
      .validateFields()
      .then((values) => {
        values.physicalExam = process_OutpatientDocument_physicalExam_local(values.physicalExam)
        handleSubmit(values)
      })
      .catch((error) => {
        console.log('error', error)
        message.error(get(error, 'errorFields.0.errors.0'));
        form.scrollToField(get(error, 'errorFields.0.name.0'));
      });
  }






  function closeModal(type: 'isShowMenzhen' | 'isShowResultImport' | '', items?: any, key?: any) {
    if (size(items) > 0) setItemValue(items, key);
    if (type === 'isShowMenzhen') {
      set_isShowMenzhen(false)
    }
    if (type === 'isShowResultImport') {
      set_isShowResultImport(false)
    }

  };




  function showpdf() {

    mchcModal__.open('print_modal', {
      modal_data: {
        requestData: {
          url: '/api/pdf-preview',
          resource: 'prenatalVisit1',
          id: form_id,
          template: '',
          version: '',
          note: '',

        }
      }
    })
  }
  function initial_preview() {

    mchcModal__.open('print_modal', {
      modal_data: {
        requestData: {
          url: '/api/pdf-preview',
          resource: 'prenatalVisit2',
          id: mchcUtils.getDoctorEndId(),
          template: '',
          version: '',
          note: '',

        }
      }
    })

  }

  function sign() {
    request
      .get('/api/doctor/updateRvisitRecordOfDoctorSign', { params: { id: form_id }, successText: '签名成功' })
      .then(getVisitsData)
  }
  function copy() {
    if (mchcEnv.in(['南医附属'])) {
      request.get('/api/doctor/getRvisitRecordCopied', { params: { id: form_id }, successText: '复制成功' })
        .then(r => {
          copyText(r.data)
        })
    } else {
      message.warning('暂未开发该功能，敬请期待')
    }
  }





  const saveBtnTxt = canSave ? `保存${mchcEnv.is('华医') ? '并关闭' : ''}` : '无权限保存'
  return (
    <Card
      title={form_id ? "编辑产检记录" : "本次产检信息"}
      bordered={false}
      size="small"
      style={{ overflowY: 'scroll' }}
      extra={
        <span id="extra" style={{ display: 'inline-block', minWidth: 75, height: 24, marginLeft: 98 }}>
          {form_id
            ? (
              <>
                <Button icon={<PlusOutlined />} type="primary" size="small" onClick={() => {
                  form.resetFields()
                  onAddBtnClick()
                }} style={{ marginRight: 36 }}>
                  新增产检记录
                </Button>
              </>

            ) : null}
          <Button icon={<SyncOutlined />} type="primary" size="small" onClick={getLastRecord} style={{ marginRight: 36 }}>
            同步上一次记录
          </Button>
        </span>
      }
    >
      <MyLazyComponent size='middle'>
        <FormBlock form={form} diagnosesList={diagnosesList ?? []} />

        <div style={{ marginLeft: '60px' }}>
          <HighRiskTableEntry headerInfo={headerInfo} data={visitsData} />
        </div>
        {!isAllPregnancies && (
          <Space className={classNames(styles['return-btns'], mchcConfig.get('医生端_复诊按钮浮动') ? styles['fixed'] : null)}>
            {
              addon_btns?.(formData, props.furtherRefresh)
            }
            <OkButton hidden={!mchcEnv.is('广州市八')} onClick={initial_preview}>首诊预览</OkButton>
            <OkButton hidden={!form_id} onClick={showpdf}>打印</OkButton>
            <OkButton hidden={!mchcEnv.is('南医附属') || !form_id} onClick={sign}>签名</OkButton>
            <OkButton hidden={!form_id} onClick={copy}>复制</OkButton>
            <OkButton hidden={!mchcEnv.is('郫都')} primary loading={loading} disabled={!canSave} onClick={() => on_submit(false)}>仅保存</OkButton>
            <OkButton primary loading={loading} disabled={!canSave} onClick={() => on_submit(true)}>{saveBtnTxt}</OkButton>
          </Space>
        )}
        {isShowMenzhen && <DiabetesAppointment isShowMenzhen={isShowMenzhen} closeModal={closeModal} />}

        {isShowResultImport && (
          <ResultImport
            isShowResultImport={isShowResultImport}
            closeModal={(a, b, c) => {
              set_isShowResultImport(false)
              if (b)
                form.setFieldsValue({ inspection: `${form.getFieldValue('inspection') ?? ''} / ${b}` })
            }}
            headerInfo={headerInfo}
            importTitle={''}

          />
        )}

        {<PreventPreeclampsia
          changePreventPreeclampsia={changePreventPreeclampsia}
          isShowPreventPreeclampsia={isShowPreventPreeclampsia}
          closeModal={closeModal}
        />}
      </MyLazyComponent>
    </Card>
  );
}
export default FurtherForm
