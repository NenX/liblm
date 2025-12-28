import { SaveOutlined } from '@ant-design/icons';
import { Button, Card, Space, message } from 'antd';
import { cloneDeep, get, isEqual, set, size } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../../.api';
import DiabetesAppointment from '../../../.components/DiabetesAppointment';
import ResultImport from '../../../.components/ResultImport';
import PreventPreeclampsia from '../../../.components/PreventPreeclampsia';
import { EventEmitter_Old, MyForm, getFormData } from '@lm_fe/components_m';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitInfoOfOutpatient, IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit, IMchc_Pregnancy, SLocal_SystemConfig, SMchc_Doctor, TIdTypeCompatible } from '@lm_fe/service';
import { checkAssociatedForm, getDynamicFormConfig } from './config';
import GesWeek from './ges-week';
import './index.less';
import { mchcEnv, mchcEvent, otherOptions } from '@lm_fe/env';
import { PlusOutlined } from '@ant-design/icons'
import { HighRiskTableEntry, mchcModal__ } from '@lm_fe/pages';
import { getFutureDate } from '@lm_fe/utils';

// 弹窗枚举
interface IProps {
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo,
  visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient
  formData: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>,
  diagnosesList: IMchc_Doctor_Diagnoses[]
  hasCurrentDoctorRecord: boolean
  isAllPregnancies: boolean

  changePreventPreeclampsia(v: boolean): void,
  updateHeaderInfo(id: TIdTypeCompatible): void,

  setDiagnosesList(v: IMchc_Doctor_Diagnoses[]): void
  onAddBtnClick(): void,
  formHandler: any,
  setFormHandler(v: any): void
  isShowPreventPreeclampsia: boolean,

  getLastRecord(): void,
  getVisitsData(): Promise<void>,



  formChange(b: boolean): void
  canSave: boolean
  loading: boolean
  handleSubmit(): Promise<void>


}
function FurtherForm(props: IProps) {

  const { getLastRecord } = props;
  const { formChange } = props;
  const { diagnosesList,
    formData,
    visitsData,
    hasCurrentDoctorRecord,
    isAllPregnancies,
    headerInfo,
    updateHeaderInfo,
    changePreventPreeclampsia,
    setDiagnosesList,
    onAddBtnClick,
    isShowPreventPreeclampsia,
    canSave,
    handleSubmit,
    formHandler,
    setFormHandler,
    loading,
  } = props;

  const [formConfig, set_formConfig] = useState([])
  const [isShowMenzhen, set_isShowMenzhen] = useState(false)
  const [isShowGesWeek, set_isShowGesWeek] = useState(false)
  const [isShowResultImport, set_isShowResultImport] = useState(false)
  const [isShowDiagReminder, set_isShowDiagReminder] = useState(false)
  const [prindId, set_prindId] = useState('')


  const formRef = useRef({})



  useEffect(() => {
    api.further.getFurtherFormConfig()
      .then(config => {
        set_formConfig(get(config, 'fields'))
      })
    EventEmitter_Old.subscribe('templateSelect', subscribeMonitor);
    return () => {
      EventEmitter_Old.unSubscribe('templateSelect', subscribeMonitor);

    }
  }, [])

  useEffect(() => {



    if (formHandler && formHandler.listenFormData) {
      formHandler.listenFormData(() => {
        formChange(true);
      });
    }

    if (formHandler.subscribe) {
      formHandler.subscribe('visitDate', 'change', (val: any) => {
        const pregnancyId = headerInfo?.id;
        const params = { date: val, id: pregnancyId };
        api.calcGesWeek(params).then((data) => {
          formHandler.gestationalWeek.actions.setValue(get(data, 'gestationalWeek'));
        });
      });

      formHandler.subscribe('appointmentCycle', 'change', (val: any) => {
        const day = val || 0;
        formHandler.appointmentDate.actions.setValue(getFutureDate(day));
      });

      formHandler.subscribe('inspection', 'click', (val: any) => {
        set_isShowResultImport(true)
      });

      formHandler.subscribe('gestationalWeek', 'click', (val: any) => {
        set_isShowGesWeek(true)
      });
      formHandler.subscribe('syncBtn', 'click', (val: any) => {
        getLastRecord();
      });
      // formHandler.subscribe('prescription', 'focus', (val: any) => {
      //   EventEmitter_Old.dispatch('prescriptionFoucs');
      // });
      // formHandler.subscribe('prescription', 'blur', (val: any) => {
      //   EventEmitter_Old.dispatch('prescriptionBlur');
      // });
    }
  }, [formChange, formHandler])






  function subscribeMonitor(value: any) {
    // EventEmitter_Old.dispatch('prescriptionFoucs');
    const prescription = formHandler.prescription.actions.getValue().value || '';
    formHandler.prescription.actions.setValue(`${prescription}${prescription ? ';' : ''}${value}`);
    formRef.current && formRef.current[`prescription`]?.current?.focus?.();
  }



  function setItemValue(val: string, key: string) {
    if (key === 'gestationalWeek') {
      formHandler.gestationalWeek.actions.setValue(val);
    } else {
      let tempValue = formHandler[key].actions.getValue().value || '';
      if (tempValue.indexOf(val) === -1) tempValue += `${val}；`;
      formHandler[key].actions.setValue(tempValue);
    }
  };










  function closeModal(type: 'isShowMenzhen' | 'isShowResultImport' | 'isShowGesWeek' | '', items?: any, key?: any) {
    if (size(items) > 0) setItemValue(items, key);
    if (type === 'isShowMenzhen') {
      set_isShowMenzhen(false)
    }
    if (type === 'isShowResultImport') {
      set_isShowResultImport(false)
    }
    if (type === 'isShowGesWeek') {
      set_isShowGesWeek(false)
    }
  };
  function Treatmentmeasures(items?: any, key?: any) {
    if (size(items) > 0) setItemValue(items, key);
  };

  function getVisitDate() {
    const visitDate = formHandler['visitDate'].actions.getValue().value;
    return visitDate;
  };

  function showpdf() {

    const id = get(formData, 'id');
    if (id) {
      mchcModal__.open('print_modal', {
        modal_data: {
          requestData: {
            url: '/api/pdf-preview',
            resource: 'prenatalVisit1',

            id,
            template: '',
            version: '',
            note: '',

          }
        }
      })
    } else {
      message.error('请先保存');
    }
  }


  function setRef(fieldName: string, ref: any) {
    formRef.current = { ...formRef.current, [fieldName]: ref };
  }





  const dynamicFormConfig = cloneDeep(getDynamicFormConfig(formConfig, diagnosesList));
  const saveBtnTxt = canSave ? `保存${mchcEnv.is('华医') ? '并关闭' : ''}` : '无权限保存'

  return (
    <Card
      title={formData?.id ? "编辑产检记录" : "本次产检信息"}
      bordered={false}
      size="small"
      className="prenatal-visit-main_return-form label-width4"
      extra={
        <span id="extra" style={{ display: 'inline-block', minWidth: 75, height: 24, marginLeft: 98 }}>
          {formData?.id
            // && !hasCurrentDoctorRecord
            ? (
              <Button icon={<PlusOutlined />} type="primary" size="small" onClick={onAddBtnClick} style={{ marginRight: 36 }}>
                新增产检记录
              </Button>
            ) : null}
        </span>
      }
    >
      <MyForm
        disabled_all={!canSave}
        config={dynamicFormConfig}
        value={formData}
        getFormHandler={setFormHandler}
        submitChange={false}
        setRef={setRef}
      />
      <div style={{ marginLeft: '60px' }}>
        <HighRiskTableEntry headerInfo={headerInfo} data={visitsData} />
      </div>
      {!isAllPregnancies && (
        <Space className="return-btns">
          <Button type="primary" icon={<SaveOutlined />} size="large" onClick={showpdf.bind(this)}>
            打印病历
          </Button>
          <Button loading={loading} disabled={!canSave} type="primary" size="large" icon={<SaveOutlined />} onClick={handleSubmit}>
            {saveBtnTxt}
          </Button>
        </Space>
      )}
      {isShowMenzhen && <DiabetesAppointment isShowMenzhen={isShowMenzhen} closeModal={closeModal} />}
      {
        formData ? <GesWeek
          isShowGesWeek={isShowGesWeek}
          closeModal={closeModal}
          Treatmentmeasures={Treatmentmeasures}
          getVisitDate={getVisitDate}
          updateHeaderInfo={updateHeaderInfo}
          headerInfo={headerInfo}
        /> : null
      }
      {isShowResultImport && (
        <ResultImport
          isShowResultImport={isShowResultImport}
          closeModal={closeModal}
          headerInfo={headerInfo}
          importTitle={''}

        />
      )}

      {<PreventPreeclampsia
        changePreventPreeclampsia={changePreventPreeclampsia}
        isShowPreventPreeclampsia={isShowPreventPreeclampsia}
        closeModal={closeModal}
      />}
    </Card>
  );
}
export default FurtherForm





export const returnFormConfig = (list: any) => {
  let config: Array<any> = [
    // { name: '', key: '', label: '本次产检记录', header_label: true, just_header: true, input_type: '' },
    { name: 'id', key: '.id', label: '', input_type: 'input', hidden: true },
    {
      name: 'visitDate',
      key: '.visitDate',
      label: '日期',
      input_type: 'date',
      span: 6,
      rules: [{ required: true }],
    },
    {
      name: 'gestationalWeek',
      key: '.gestationalWeek',
      label: '孕周',
      input_type: 'input',
      span: 6,
      rules: [{ required: true }],
    },
    {
      name: 'weight',
      key: '.physicalExam.weight',
      label: '体重',
      unit: 'kg',
      input_type: 'input',
      span: 6,
      rules: [{ required: true }],
      input_props: { type: 'number' },
    },
    {
      name: 'physicalExam.systolic+diastolic',
      key: '.physicalExam.systolic+diastolic',
      input_type: 'bloodPressureInput',
      label: '血压-首测',
      // unit: 'mmHg',
      span: 6,
      is_new_row: true,
    },
    {
      name: 'physicalExam.systolic2+diastolic2',
      key: '.physicalExam.systolic2+diastolic2',
      input_type: 'bloodPressureInput',
      label: '血压-二测',
      // unit: 'mmHg',
      span: 6,
    },
    {
      name: 'physicalExam.systolic3+diastolic3',
      key: '.physicalExam.systolic3+diastolic3',
      input_type: 'bloodPressureInput',
      label: '血压-三测',
      // unit: 'mmHg',
      span: 6,
    },
    {
      name: 'chiefComplaint',
      key: '.chiefComplaint',
      label: '主诉',
      input_type: 'input',
      span: 18,
      input_props: { type: 'textarea' },
      is_new_row: true,
    },
    {
      name: 'template',
      key: '',
      label: '模板',
      input_type: 'button',
      span: 6,
      input_props: { btn_text: ['主诉模板'] },
    },
    {
      name: 'fundalHeight',
      key: '.gynecologicalExam.fundalHeight',
      label: '宫高',
      unit: 'cm',
      input_type: 'input',
      input_props: { type: 'number' },
      span: 6,
    },
    {
      name: 'waistHip',
      key: '.gynecologicalExam.waistHip',
      label: '腹围',
      unit: 'cm',
      input_type: 'input',
      input_props: { type: 'number' },
      span: 6,
    },
    {
      name: 'edema',
      key: '.generalExam.edema',
      label: '下肢水肿',
      input_type: 'select',
      span: 6,
      input_props: { options: otherOptions.edemaOptions },
    },

    /* 胎儿信息表单 */
    {
      name: 'fetuses',
      key: '.fetuses',
      input_type: 'array-custom',
      is_new_row: true,
      input_props: {
        array_title: '胎儿',
        config: [
          { name: 'id', key: '.id', label: 'id', input_type: 'input', hidden: true, span: 5 },
          {
            name: 'fetalMovement',
            key: '.fetalMovement',
            label: '胎动',
            input_type: 'select',
            span: 6,
            input_props: { options: otherOptions.fetalMovementOptions },
          },
          {
            name: 'fetalHeartRate',
            key: '.fetalHeartRate',
            label: '胎心率',
            input_type: 'input',
            span: 6,
            unit: 'bpm',
            input_props: { type: 'number' },
          },
          {
            name: 'presentation',
            key: '.presentation',
            label: '先露',
            input_type: 'select',
            span: 6,
            input_props: { options: otherOptions.presentationOptions },
          },
          {
            name: 'fetalPosition',
            key: '.fetalPosition',
            label: '位置',
            input_type: 'select',
            span: 6,
            input_props: { options: otherOptions.positonOptions },
          },
        ],
      },
    },

    /* 胎儿超声表单 */
    {
      name: 'pvUltrasounds',
      key: '.pvUltrasounds',
      input_type: 'array-custom',
      is_new_row: true,
      hidden: checkAssociatedForm(list, 'ultrasounds'),
      input_props: {
        array_title: '超声',
        config: [
          { name: 'id', key: '.id', label: 'id', input_type: 'input', hidden: true, span: 5 },
          {
            name: 'fetalweight',
            key: '.fetalweight',
            label: '胎儿体重',
            input_type: 'input',
            span: 6,
            unit: 'g',
            input_props: { type: 'number' },
          },
          {
            name: 'afv',
            key: '.afv',
            label: 'AFV',
            input_type: 'input',
            span: 6,
            unit: 'mm',
            input_props: { type: 'number' },
          },
          { name: 'ubf', key: '.ubf', label: '脐血流', input_type: 'input', span: 6 },
        ],
      },
    },

    /* 妊娠糖尿病表单 */
    {
      name: 'fbg',
      key: '.pvGdm.fbg',
      label: 'FBG',
      input_type: 'input',
      span: 6,
      unit: 'mmol/L',
      rules: [{ type: 'rang', min: 0, max: 5.3 }],
      hidden: checkAssociatedForm(list, 'diabetes'),
      input_props: { type: 'number' },
    },
    {
      name: 'pbg2',
      key: '.pvGdm.pbg2',
      label: 'P2BG',
      input_type: 'input',
      span: 6,
      unit: 'mmol/L',
      rules: [{ type: 'rang', min: 0, max: 6.7 }],
      hidden: checkAssociatedForm(list, 'diabetes'),
      input_props: { type: 'number' },
    },
    {
      name: 'hbalc',
      key: '.pvGdm.hbalc',
      label: 'HbAlc',
      input_type: 'input',
      span: 6,
      unit: '%',
      rules: [{ type: 'rang', min: 0, max: 6.4 }],
      hidden: checkAssociatedForm(list, 'diabetes'),
      input_props: { type: 'number' },
    },

    // {
    //   name: '',
    //   key: '',
    //   label: '胰岛素方案',
    //   header_label: true,
    //   just_header: true,
    //   input_type: 'label',
    //   hidden: checkAssociatedForm(list, 'diabetes'),
    // },
    {
      name: 'insProgram',
      key: '.pvGdm.insProgram',
      label: '胰岛素方案',
      input_type: 'input',
      span: 18,
      hidden: checkAssociatedForm(list, 'diabetes'),
    },
    // {
    //   name: 'insbname',
    //   key: '.pvGdm.insbname',
    //   label: '早',
    //   input_type: 'autoComplete',
    //   span: 4,
    //   hidden: checkAssociatedForm(list, 'diabetes'),
    //   input_props: { options: otherOptions.insOptions },
    // },
    // {
    //   name: 'insbu',
    //   key: '.pvGdm.insbu',
    //   label: '',
    //   input_type: 'input',
    //   span: 2,
    //   unit: 'U',
    //   hidden: checkAssociatedForm(list, 'diabetes'),
    //   input_props: { type: 'number' },
    // },
    // {
    //   name: 'inslname',
    //   key: '.pvGdm.inslname',
    //   label: '中',
    //   input_type: 'autoComplete',
    //   span: 4,
    //   hidden: checkAssociatedForm(list, 'diabetes'),
    //   input_props: { options: otherOptions.insOptions },
    // },
    // {
    //   name: 'inslu',
    //   key: '.pvGdm.inslu',
    //   label: '',
    //   input_type: 'input',
    //   span: 2,
    //   unit: 'U',
    //   hidden: checkAssociatedForm(list, 'diabetes'),
    //   input_props: { type: 'number' },
    // },
    // {
    //   name: 'insdname',
    //   key: '.pvGdm.insdname',
    //   label: '晚',
    //   input_type: 'autoComplete',
    //   span: 4,
    //   hidden: checkAssociatedForm(list, 'diabetes'),
    //   input_props: { options: otherOptions.insOptions },
    // },
    // {
    //   name: 'insdu',
    //   key: '.pvGdm.insdu',
    //   label: '',
    //   input_type: 'input',
    //   span: 2,
    //   unit: 'U',
    //   hidden: checkAssociatedForm(list, 'diabetes'),
    //   input_props: { type: 'number' },
    // },
    // {
    //   name: 'inssname',
    //   key: '.pvGdm.inssname',
    //   label: '睡前',
    //   input_type: 'autoComplete',
    //   span: 4,
    //   hidden: checkAssociatedForm(list, 'diabetes'),
    //   input_props: { options: otherOptions.insOptions },
    // },
    // {
    //   name: 'inssu',
    //   key: '.pvGdm.inssu',
    //   label: '',
    //   input_type: 'input',
    //   span: 2,
    //   unit: 'U',
    //   hidden: checkAssociatedForm(list, 'diabetes'),
    //   input_props: { type: 'number' },
    // },

    /* 妊娠高血压表单 */
    {
      name: '',
      key: '',
      label: '尿蛋白',
      header_label: true,
      just_header: true,
      input_type: 'label',
      hidden: checkAssociatedForm(list, 'hypertension'),
    },
    {
      name: 'quality',
      key: '.pvPih.quality',
      label: '定性',
      input_type: 'input',
      span: 6,
      hidden: checkAssociatedForm(list, 'hypertension'),
    },
    {
      name: 'quantity',
      key: '.pvPih.quantity',
      label: '24H定量',
      input_type: 'input',
      span: 6,
      hidden: checkAssociatedForm(list, 'hypertension'),
    },
    {
      name: 'pvPihMedication',
      key: '.pvPih.medication',
      label: '用药方案',
      input_type: 'autoComplete',
      span: 12,
      hidden: checkAssociatedForm(list, 'hypertension'),
      input_props: { options: otherOptions.pvPihOptions },
    },

    {
      name: 'otherNote',
      key: '.pvCardiacDisease.otherNote',
      label: '其他异常特征',
      input_type: 'input',
      span: 18,
    },

    /* 心脏病表单 */
    {
      name: 'heartrate',
      key: '.pvCardiacDisease.heartrate',
      label: '心率',
      input_type: 'input',
      span: 6,
      unit: '次/分',
      is_new_row: true,
      hidden: checkAssociatedForm(list, 'coronary'),
      input_props: { type: 'number' },
    },
    {
      name: 'pvCardiacDiseaseMedication',
      key: '.pvCardiacDisease.medication',
      label: '用药情况',
      input_type: 'input',
      span: 12,
      hidden: checkAssociatedForm(list, 'coronary'),
    },

    /* ICP表单 */
    {
      name: 'tba',
      key: '.pvIcp.tba',
      label: 'TBA',
      input_type: 'input',
      span: 6,
      unit: 'umol/L',
      is_new_row: true,
      hidden: checkAssociatedForm(list, 'ICP'),
      input_props: { type: 'number' },
    },
    {
      name: 'alt',
      key: '.pvIcp.alt',
      label: 'ALT',
      input_type: 'input',
      span: 6,
      unit: 'U/L',
      hidden: checkAssociatedForm(list, 'ICP'),
      input_props: { type: 'number' },
    },
    {
      name: 'ast',
      key: '.pvIcp.ast',
      label: 'AST',
      input_type: 'input',
      span: 6,
      unit: 'U/L',
      hidden: checkAssociatedForm(list, 'ICP'),
      input_props: { type: 'number' },
    },

    /* 甲减表单 */
    {
      name: 'tsh',
      key: '.pvHypothyroidism.tsh',
      label: 'TSH',
      input_type: 'input',
      span: 6,
      unit: 'uIU/ml',
      hidden: checkAssociatedForm(list, 'hypothyroidism'),
      input_props: { type: 'number' },
      is_new_row: true,
    },
    {
      name: 't4',
      key: '.pvHypothyroidism.t4',
      label: '游离T4',
      input_type: 'input',
      span: 6,
      unit: 'pmol/L',
      hidden: checkAssociatedForm(list, 'hypothyroidism'),
      input_props: { type: 'number' },
    },

    {
      name: 'inspection',
      key: '.inspection',
      label: '检验检查',
      input_type: 'input',
      span: 18,
      input_props: { type: 'textarea' },
      is_new_row: true,
    },
    {
      name: 'template',
      key: '',
      label: '结果导入',
      input_type: 'button',
      span: 6,
      input_props: { btn_text: ['检验结果导入', '超声结果导入'] },
    },
    {
      name: 'prescription',
      key: '.prescription',
      label: '处理措施',
      input_type: 'input',
      span: 18,
      input_props: { type: 'textarea' },
      rules: [{ required: true }],
    },
    {
      name: 'template',
      key: '',
      label: '模板',
      input_type: 'button',
      span: 6,
      input_props: { btn_text: ['处理模板'] },
    },

    {
      name: 'appointmentType',
      key: '.appointmentType',
      label: '下次复诊',
      input_type: 'select',
      span: 5,
      is_new_row: true,
      input_props: { options: otherOptions.appointmentTypeOptions },
    },
    {
      name: 'appointmentCycle',
      key: '.appointmentCycle',
      label: '',
      input_type: 'select',
      span: 2,
      input_props: { options: otherOptions.appointmentCycleOptions, style: { marginLeft: '-1px' } },
    },
    {
      name: 'appointmentDate',
      key: '.appointmentDate',
      label: '',
      input_type: 'date',
      span: 3,
      rules: [{ required: true }],
      input_props: {
        style: { height: 32, marginLeft: '-2px' },
      },
    },
    {
      name: 'appointmentPeriod',
      key: '.appointmentPeriod',
      label: '',
      input_type: 'select',
      span: 2,
      input_props: { options: otherOptions.appointmentPeriodOptions, style: { marginLeft: '-3px' } },
    },
  ];
  return config;
};