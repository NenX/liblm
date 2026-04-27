import { PrinterOutlined, SaveOutlined, TableOutlined, SyncOutlined } from '@ant-design/icons';
import { LazyAntd, useMyEffectSafe } from '@lm_fe/components';
import { FormSectionForm } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent, mchcUtils, mchcLogger, mchcDriver } from '@lm_fe/env';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_FirstVisitDiagnosisOutpatient, IMchc_Doctor_OutpatientHeaderInfo, SMchc_Doctor, TIdType, TIdTypeCompatible } from '@lm_fe/service';
import { getFutureDate, request } from '@lm_fe/utils';
import { Button, Col, message, Modal, Row, Space } from 'antd';
import { forEach, get, isNil, isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import DiabetesAppointment from '../../../.components/DiabetesAppointment';
import Diagnoses from '../../../.components/Diagnoses';
import DiagReminder from '../../../.components/DiagReminder';
import PreventPreeclampsia from '../../../.components/PreventPreeclampsia';
import ManagementPlan from '../../../.further/components/FurtherSidebar/management-plan';
import './index.less';
import { SLocal_State } from '@lm_fe/service';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

import { BF_Wrap2, HighRiskTableEntry } from '@lm_fe/pages';
import { api } from '../../../.api';
import { IInitial_Tab_props } from '../../types';
import { FormInstance } from 'antd/es/form/Form';
interface IProps {
  diagnosis_addon_btns?: (data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient, refresh?: () => void) => React.ReactNode
  diagnosis_before_submit?: (submit: (values: any) => Promise<void>, data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient, form?: FormInstance, sync?: Boolean) => Promise<void>
  canSave: boolean
  noShowBtn: boolean
  serialNo: string

  changeScreening(b: boolean): void
  changeSyphilis(b: boolean): void
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo,
  diagnosesList: IMchc_Doctor_Diagnoses[]
  changePreventPreeclampsia(b: boolean): void,
  isShowPreventPreeclampsia: boolean
  handlePrint?(resource: string, id?: TIdType): void
  setDiagnosesList(l: IMchc_Doctor_Diagnoses[]): void
  setDiagnosesWord(v: string): void
  saveHeaderInfo(v: IMchc_Doctor_OutpatientHeaderInfo): void
  diagnosesWord: string
  getHighriskDiagnosis(v: TIdTypeCompatible): void

}

const Title = '诊断处理';
const ClassName = 'zhen-duan-chu-li';
function Index(props: IProps & IInitial_Tab_props) {

  const { serialNo,
    diagnosesList,
    changeScreening,
    handlePrint: _handlePrint,
    noShowBtn,
    canSave,


    headerInfo,
    changePreventPreeclampsia,
    isShowPreventPreeclampsia,
    changeSyphilis,
    setDiagnosesList,
    setDiagnosesWord,
    diagnosesWord,
    getHighriskDiagnosis,
    saveHeaderInfo,
    active,
    diagnosis_before_submit,
    diagnosis_addon_btns,
    form
  } = props;
  const preg_id = mchcUtils.getDoctorEndId()

  const { Wrap, config } = BF_Wrap2({ default_conf: { title: '门诊-诊断处理', tableColumns: () => import('./config') } })


  const [isShowMenzhen, set_isShowMenzhen] = useState(false)
  const [isShowModifyRecord, set_isShowModifyRecord] = useState(false)
  const [isShowDiagReminder, set_isShowDiagReminder] = useState(false)
  const [isShowManageModal, set_isShowManageModal] = useState(false)

  const [recordData, set_recordData] = useState([])
  const [visitData, setVisitData] = useState<IMchc_Doctor_FirstVisitDiagnosisOutpatient>()


  useEffect(() => {

    if (active) {
      initData()
    }


    return () => {

    }
  }, [active])
  useMyEffectSafe(props)(() => {
    const rm = mchcEvent.on_rm('my_form', async e => {
      // mchcEnv.logger.log('event receive', { e, })
      if (e.type === 'onChange' && e.name === 'advice') {

        const values = e.values;
        const value = e.value;
        const key = e.name

        if (!isNil(value.appointmentCycle)) {
          e.setValue?.('advice', { appointmentDate: getFutureDate(value.appointmentCycle) })
        }

      }

    })
    return rm
  }, [])

  function initData() {

    SMchc_Doctor.getFirstVisitDiagnosisOutpatient(preg_id).then(v => {
      setVisitData(v)
      form.setFieldsValue(v)
    })
  }


  function handleSubmitBefore(sync: boolean = true) {
    // sync 用于郫都 传false的时候单纯保存记录   不回写记录给HIS
    if (diagnosis_before_submit) {
      return diagnosis_before_submit(handleSubmit, visitData, form, sync)
    }
    const values = form.getFieldsValue()
    handleSubmit(values)
  }
  async function handleSubmit(values) {
    const re = await SMchc_Doctor.updateFirstVisitDiagnosisOutpatient({
      currentGestationalWeek: get(headerInfo, 'curgesweek')
        ? get(headerInfo, 'curgesweek')
        : get(headerInfo, 'gesweek'),
      diagnoses: diagnosesList,
      serialNo,
      ...values
    })
    HighRiskTableEntry.highRiskTablePopup(re);

  };


  function closeModal(type: 'isShowMenzhen' | 'isShowModifyRecord' | 'isShowDiagReminder' | 'isShowManageModal', items?: any, key?: any) {

    if (type === 'isShowDiagReminder') {
      set_isShowDiagReminder(false)
    } else if (type === 'isShowManageModal') {
      set_isShowManageModal(false)

    } else if (type === 'isShowMenzhen') {
      set_isShowMenzhen(false)

    } else if (type === 'isShowModifyRecord') {
      set_isShowModifyRecord(false)

    }
  };

  function handlePrint(type: 'prenatalVisit1' | 'prenatalVisit') {
    if (!_handlePrint) return
    if (type == 'prenatalVisit1') {
      const id = get(visitData, `advice.id`);
      if (id) {
        _handlePrint(type, id);
      } else {
        message.warning('请先保存');
      }
    } else {
      _handlePrint(type, undefined);
    }
  }

  async function handleRecordBtn() {
    const { headerInfo } = props;
    const pregnancyId = headerInfo?.id
    const recordData = await api.initial.findFirstVisitOperatingRecord(pregnancyId);

    set_recordData(recordData)
    set_isShowModifyRecord(true)
  };

  function renderModifyRecord() {
    const columns = [
      {
        title: '编号',
        dataIndex: 'items',
        key: 'items',
        render: (text: any, record: any, index: any) => index + 1,
        width: 30,
      },
      { title: '时间', dataIndex: 'operateDate', key: 'operateDate', width: 50 },
      { title: '修改人', dataIndex: 'operator', key: 'operator', width: 50 },
      {
        title: '修改字段',
        dataIndex: 'content',
        key: 'content',
        render: (text: any) => {
          let str = '';
          forEach(text, (item) => {
            str += `${get(item, 'operatingDescription')}；`;
          });
          return str;
        },
        width: 200,
      },
    ];

    return (
      <Modal
        visible={isShowModifyRecord}
        title="历史首检记录"
        footer={null}
        width="80%"
        onCancel={() => set_isShowModifyRecord(false)}
      >
        <Table className="prenatal-visit-main-table" columns={columns} dataSource={recordData} pagination={false} />
      </Modal>
    );
  }




  return (
    <Row gutter={16} className="zhen-duan label-width5">
      <Col span="8">
        <Diagnoses
          changeScreening={changeScreening}
          changeSyphilis={changeSyphilis}
          saveHeaderInfo={saveHeaderInfo}
          setDiagnosesList={setDiagnosesList}
          setDiagnosesWord={setDiagnosesWord}
          diagnosesWord={diagnosesWord}
          getHighriskDiagnosis={getHighriskDiagnosis}
          headerInfo={headerInfo}
          diagnosesList={diagnosesList}
          noshowlist={false}
          isAllPregnancies={false}


          serialNo={serialNo}

          page={''}
        />
      </Col>
      <Col span="16">
        <div className="form-wrapper">

          <Wrap>
            <FormSectionForm
              onValuesChange={(changedValues) => {

              }}
              onFinish={(v) => {
                const values = form.getFieldsValue()
                handleSubmit(values)
              }}
              formDescriptions={__DEV__ ? () => import('./config') : config?.tableColumns}

              form={form}
            />
          </Wrap>
          <Button hidden={mchcEnv.is('广三')} className="his-btn" type="dashed" icon={<TableOutlined />} onClick={handleRecordBtn}>
            首检信息历史修改记录
          </Button>
          <Button
            hidden={mchcEnv.is('广三')}
            className="his-btn"
            type="dashed"
            icon={<TableOutlined />}
            onClick={() => set_isShowManageModal(true)}
          >
            产检计划
          </Button>
          <div style={{ marginTop: '10px' }}>
            <HighRiskTableEntry headerInfo={headerInfo} data={visitData} />

            <Button icon={<SyncOutlined />} size="large" onClick={initData} style={{ marginLeft: 12 }}>
              刷新
            </Button>
          </div>
        </div>
        {!noShowBtn && (
          <Space className="prenatal-visit-main_initial-btns">
            {
              diagnosis_addon_btns?.(visitData, initData)
            }
            <Button size="large" onClick={() => handlePrint('prenatalVisit')} icon={<PrinterOutlined />}>
              打印档案
            </Button>
            <Button size="large" onClick={() => handlePrint('prenatalVisit1')} icon={<PrinterOutlined />}>
              打印病历
            </Button>

            <Button size="large" hidden={!mchcEnv.is('郫都')} type="primary" disabled={!canSave} onClick={() => handleSubmitBefore(false)}>仅保存</Button>
            <Button size="large" type="primary" disabled={!canSave} onClick={() => handleSubmitBefore(true)} icon={<SaveOutlined />}>
              保存{mchcEnv.is('华医') ? '并关闭' : ''}
            </Button>
          </Space>
        )}
      </Col>
      {isShowMenzhen && <DiabetesAppointment isShowMenzhen={isShowMenzhen} closeModal={closeModal} />}
      {false && isShowDiagReminder && (
        <DiagReminder isShowDiagReminder={isShowDiagReminder} data={[]} cancelModal={() => closeModal} />
      )}
      {
        <PreventPreeclampsia closeModal={closeModal}

          changePreventPreeclampsia={changePreventPreeclampsia}
          isShowPreventPreeclampsia={isShowPreventPreeclampsia}
        />
      }
      {isShowManageModal && (
        <ManagementPlan isShowManageModal={isShowManageModal} closeModal={closeModal} headerInfo={headerInfo} />
      )}
      {renderModifyRecord()}
    </Row>
  );
}

Object.assign(Index, { Title, Config: null, ClassName })
export default Index
