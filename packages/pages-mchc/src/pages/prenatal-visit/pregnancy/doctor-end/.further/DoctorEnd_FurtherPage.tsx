import { formatTimeToDate, getFormData } from '@lm_fe/components_m';
import { mchcConfig, mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitInfoOfOutpatient, IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit, SMchc_Doctor, TIdTypeCompatible } from '@lm_fe/service';
import { getSearchParamsValue } from '@lm_fe/utils';
import { Form, FormInstance, message } from 'antd';
import { cloneDeep, find, forEach, get, set } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import FurtherForm from './components/FurtherForm';
import FurtherSidebar from './components/FurtherSidebar';
import FurtherTable from './components/FurtherTable';
import './index.less';
import { filter_diagnoses } from '../.utils'
import { HighRiskTableEntry } from '@lm_fe/pages';
const getDoctorEndId = mchcUtils.getDoctorEndId
export interface IDoctorEnd_FurtherProps {
  addon_btns?: (data?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>) => React.ReactNode
  before_submit?: (submit: (values: any) => Promise<void>, data?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>, form?: FormInstance, sync?: Boolean) => Promise<void>
  refreshData?(): void
  setDiagnosesList(v: IMchc_Doctor_Diagnoses[]): void
  id: TIdTypeCompatible

  headerInfo: IMchc_Doctor_OutpatientHeaderInfo

  changeScreening(b: boolean): void
  changeSyphilis(b: boolean): void

  diagnosesList: IMchc_Doctor_Diagnoses[]
  changePreventPreeclampsia(b: boolean): void,
  formChange(b: boolean): void,
  isShowPreventPreeclampsia: boolean
  diagnosesWord: string
  getHighriskDiagnosis(id: TIdTypeCompatible): void


  saveHeaderInfo(h: IMchc_Doctor_OutpatientHeaderInfo): void,
  setDiagnosesWord(t: string): void,
}

function DoctorEnd_Further(props: IDoctorEnd_FurtherProps) {

  const {
    saveHeaderInfo,
    setDiagnosesWord,
    setDiagnosesList,
    headerInfo,
    id,
    changePreventPreeclampsia,
    isShowPreventPreeclampsia,
    changeScreening,
    changeSyphilis,
    diagnosesList,
    formChange,
    getHighriskDiagnosis,
    diagnosesWord
  } = props;

  const serialNo_q = getSearchParamsValue('serialNo')

  const [visitsData, _setVisitsData] = useState<IMchc_Doctor_RvisitInfoOfOutpatient>()

  const [formData, setFormData] = useState<Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>>()
  const [canSave, setCanSave] = useState(false)
  const [loading, setLoading] = useState(false)

  const visitsData_cache = useRef(visitsData)
  function setVisitsData(v: IMchc_Doctor_RvisitInfoOfOutpatient) {
    _setVisitsData(v)
    visitsData_cache.current = v
  }
  useEffect(() => {
    if (id) {
      getVisitsData();
    }


    return () => {

    }
  }, [id])
  const get_default_value = () => {
    return {
      // visitDate: getFutureDate(0),
      gestationalWeek: headerInfo?.gesweek
    }
  }


  async function fetchVisitData() {

    const visitInfo = await SMchc_Doctor.getRvisitInfoOfOutpatient({
      id: getDoctorEndId(props),
      serialNo: mchcEnv.is('广三') ? serialNo_q : undefined
    });

    return visitInfo

  }
  async function getVisitsData() {

    const visitInfo = await fetchVisitData()




    initDiagnoses(visitInfo)

    initVisitData(visitInfo)

    initFormData(visitInfo)



  }
  async function initDiagnoses(v: IMchc_Doctor_RvisitInfoOfOutpatient) {


    const __diagnoses = filter_diagnoses(v.diagnoses)


    setDiagnosesList?.(__diagnoses);

  }
  async function initVisitData(v: IMchc_Doctor_RvisitInfoOfOutpatient) {



    setVisitsData(v)


    changeDoctorRecord(v)

  }

  function get_id_null_data(v?: IMchc_Doctor_RvisitInfoOfOutpatient) {




    const rvisits = v?.rvisits ?? [];
    const idNullRvisit = rvisits.find(_ => _.id === null)


    return cloneDeep(idNullRvisit)


  }
  function initFormData_toAdd(v?: IMchc_Doctor_RvisitInfoOfOutpatient) {



    if (!v) {
      setFormData(get_default_value())
      return
    }

    const idNullRvisit = get_id_null_data(v)
    const first = idNullRvisit ?? get_default_value()

    console.log({ first })
    setFormData(first)
    setCanSave(true)


  }
  async function initFormData(v?: IMchc_Doctor_RvisitInfoOfOutpatient) {

    if (!v) {
      setFormData(get_default_value())
      return
    }
    const rvisits = v.rvisits;
    const idNullRvisit = get_id_null_data(v)
    const first = idNullRvisit ?? rvisits[0] ?? get_default_value()

    // const _formdata_q = mchcEnv.is('广三') ? v.rvisits.find(_ => _.serialNo === serialNo_q) : null
    const _formdata_q = mchcEnv.is('广三') ? v.rvisits.find(_ => _.today) : null

    const _formdata = _formdata_q ?? first
    setFormData(_formdata)


    // if (mchcEnv.is('越秀妇幼')) {
    if (mchcConfig.get('医生端_复诊编辑控制')) {
      if (idNullRvisit) {
        setCanSave(true)
      } else {
        SMchc_Doctor.getVisitEmrEditable(first.id).then(setCanSave)
      }
    } else {
      setCanSave(true)
    }

  }
  async function handleSubmit(newData) {
    if (!canSave) return Promise.resolve()


    const outEmrId = headerInfo?.id as any;

    const __serialNo = mchcEnv.is('广三') ? serialNo_q : null

    const serialNo = __serialNo ?? formData?.serialNo!

    setLoading(true)
    if (mchcEnv.is('越秀妇幼')) {
      const xxxa = diagnosesList.map(_ => ({
        ..._,
        serialNo,
        outEmrId
      }))

      SMchc_Doctor.newOrSaveDiagnosisOfOutpatientList(xxxa).then(setDiagnosesList)
    }
    set(newData, `outEmrId`, outEmrId);
    set(newData, `serialNo`, serialNo);
    // set(newData, `id`, formData.id);
    const redata = await SMchc_Doctor.updateRvisitInfoOfOutpatient(newData);
    const v = await fetchVisitData();
    initVisitData(v)
    setFormData(redata)
    // changeVisitsData(redata);

    HighRiskTableEntry.highRiskTablePopup(redata)

    mchcEvent.emit('outpatient', { type: '刷新头部', pregnancyId: outEmrId })
    setLoading(false)
    message.success('信息保存成功');

  };


  function onAddBtnClick() {
    setDiagnosesList((visitsData?.diagnoses as any) || [])
    initFormData_toAdd(visitsData_cache.current)

  }


  function changeDoctorRecord(v: IMchc_Doctor_RvisitInfoOfOutpatient) {

    const u = mchcUtils.getUserData()
    const recordsAfterDelivery = get(v, `rvisits`);

  }

  // 同步导入上一次复诊记录的主诉等信息
  async function getLastRecord() {


    const list = get(visitsData_cache.current, `rvisits`);
    const newFormData: any = cloneDeep(find(list, (item) => item.id != null));
    console.log('newFormData', { newFormData, list, visitsData })
    if (!newFormData) return
    delete newFormData['id'];
    set(newFormData, `visitDate`, formatTimeToDate(new Date()));
    set(newFormData, `appointmentCycle`, get(formData, `appointmentCycle`));
    set(newFormData, `appointmentDate`, get(formData, `appointmentDate`));
    set(newFormData, `appointmentType`, get(formData, `appointmentType`));
    set(newFormData, `appointmentPeriod`, get(formData, `appointmentPeriod`));
    set(newFormData, `gestationalWeek`, get(formData, `gestationalWeek`));

    setFormData(newFormData)
  };



  // function changeVisitsData(new_one: IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit) {
  //   const visitData_clone = cloneDeep(visitsData)!;

  //   if (isArray(visitData_clone?.rvisits)) {
  //     // visitData_clone.rvisits.splice(0, 1, res);
  //     visitData_clone?.rvisits.forEach((item, index) => {
  //       if (get(item, 'id') == get(new_one, 'id')) {
  //         let data = visitData_clone.rvisits;
  //         data[index] = new_one;
  //       }
  //     });
  //   }


  //   setVisitsData(visitData_clone)
  //   setFormData(new_one)
  // }
  function furtherRefresh() {
    const { refreshData } = props;
    getVisitsData();
    refreshData?.();
  }


  return (
    <div className="further">

      <FurtherSidebar
        serialNo={formData?.serialNo!}
        saveHeaderInfo={saveHeaderInfo}
        setDiagnosesWord={setDiagnosesWord}
        setDiagnosesList={setDiagnosesList}
        diagnosesWord={diagnosesWord}
        getHighriskDiagnosis={getHighriskDiagnosis}
        changeScreening={changeScreening}
        changeSyphilis={changeSyphilis}
        diagnosesList={diagnosesList}

        headerInfo={headerInfo}
        id={id}


        visitsData={visitsData}
        furtherRefresh={furtherRefresh}
      />



      <div className="further-content">
        <FurtherTable
          visitsData={visitsData}
          setFormData={setFormData}
          headerInfo={headerInfo}
          formData={formData}
          furtherRefresh={furtherRefresh}
        />
        <FurtherForm
          addon_btns={props.addon_btns}
          before_submit={props.before_submit}
          loading={loading}
          handleSubmit={handleSubmit}
          onAddBtnClick={onAddBtnClick}
          visitsData={visitsData}
          formData={formData}
          getVisitsData={getVisitsData}
          getLastRecord={getLastRecord}
          headerInfo={headerInfo}
          diagnosesList={diagnosesList}
          isAllPregnancies={false}
          changePreventPreeclampsia={changePreventPreeclampsia}
          isShowPreventPreeclampsia={isShowPreventPreeclampsia}
          formChange={formChange}
          canSave={canSave}
        />
      </div>
    </div>
  );
}
export default DoctorEnd_Further
