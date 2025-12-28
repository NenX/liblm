import { PrinterOutlined, SaveOutlined, TableOutlined } from '@ant-design/icons';
import { FormConfig, getFormData, MyForm } from '@lm_fe/components_m';
import { LazyAntd } from '@lm_fe/components';
import { mchcEnv } from '@lm_fe/env';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitInfoOfOutpatient, TIdType, TIdTypeCompatible } from '@lm_fe/service';
import { getFutureDate } from '@lm_fe/utils';
import { Button, Col, message, Modal, Row, Space } from 'antd';
import { forEach, get, size } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import DiabetesAppointment from '../../../.components/DiabetesAppointment';
import Diagnoses from '../../../.components/Diagnoses';
import DiagReminder from '../../../.components/DiagReminder';
import PreventPreeclampsia from '../../../.components/PreventPreeclampsia';
import ManagementPlan from '../../../.further/components/FurtherSidebar/management-plan';
import requestMethods, { updateTabMethods } from '../../methods/request';
import config from './config';
import './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

import { api } from '../../../.api';
import { HighRiskTableEntry } from '@lm_fe/pages';
interface IProps {

  canSave: boolean
  noShowBtn: boolean
  serialNo: string

  changePreeclampsia(b: boolean): void
  changeScreening(b: boolean): void
  changeSyphilis(b: boolean): void
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo,
  visitData: IMchc_Doctor_RvisitInfoOfOutpatient
  getFormHandler(v: any): void
  diagnosesList: IMchc_Doctor_Diagnoses[]
  handleSave(v: any): void
  zdFormConfig: FormConfig[]
  changePreventPreeclampsia(b: boolean): void,
  isShowPreventPreeclampsia: boolean
  handlePrint?(resource: string, id?: TIdType): void
  changeDiagnosesTemplate(v: boolean): void
  setDiagnosesList(l: IMchc_Doctor_Diagnoses[]): void
  setDiagnosesWord(v: string): void
  saveHeaderInfo(v: IMchc_Doctor_OutpatientHeaderInfo): void
  diagnosesWord: string
  getHighriskDiagnosis(v: TIdTypeCompatible): void

}

const Title = '诊断处理';
const Config = config;
const ClassName = 'zhen-duan-chu-li';
function Index(props: IProps) {

  const { serialNo,
    visitData,
    diagnosesList,
    handleSave,
    changeScreening,
    changePreeclampsia,
    handlePrint: _handlePrint,
    zdFormConfig,
    noShowBtn,
    canSave,
    getFormHandler,


    headerInfo,
    changePreventPreeclampsia,
    isShowPreventPreeclampsia,
    changeSyphilis,
    changeDiagnosesTemplate,
    setDiagnosesList,
    setDiagnosesWord,
    diagnosesWord,
    getHighriskDiagnosis,
    saveHeaderInfo,
  } = props;


  const [formHandler, set_formHandler] = useState({})

  const [isShowMenzhen, set_isShowMenzhen] = useState(false)
  const [isShowModifyRecord, set_isShowModifyRecord] = useState(false)
  const [isShowDiagReminder, set_isShowDiagReminder] = useState(false)
  const [isShowManageModal, set_isShowManageModal] = useState(false)

  const [recordData, set_recordData] = useState([])


  const myrefs = useRef()



  useEffect(() => {

    if (formHandler.subscribe) {
      formHandler.subscribe('advice.appointmentCycle', 'change', (val: any) => {
        const day = val || 0;
        formHandler['advice.appointmentDate'].actions.setValue(getFutureDate(day));
      });
    }

  }, [formHandler])

  function setItemValue(val: string, key: string) {
    if (key === 'prescription') {
      let tempValue = formHandler.prescription.actions.getValue().value || '';
      if (tempValue.indexOf(val) === -1) tempValue += `${val}；`;
      formHandler.prescription.actions.setValue(tempValue);
    }
  };

  async function handleSubmit() {

    const { validCode, res } = await formHandler.submit();
    console.log('visit', visitData.serialNo, serialNo)

    if (validCode) {
      const resdata = getFormData(res);
      const putData = {
        ...resdata,
        id: get(visitData, `id`),
        currentGestationalWeek: get(headerInfo, 'curgesweek')
          ? get(headerInfo, 'curgesweek')
          : get(headerInfo, 'gesweek'),
        diagnoses: diagnosesList,
        serialNo,
      };
      const re = await requestMethods[updateTabMethods['tab-7']](putData);
      handleSave && handleSave(re);
      message.success('信息保存成功');
      HighRiskTableEntry.highRiskTablePopup(re);
    } else {
      message.destroy();
      message.error('请完善表单项！');
    }
  };


  function closeModal(type: 'isShowMenzhen' | 'isShowModifyRecord' | 'isShowDiagReminder' | 'isShowManageModal', items?: any, key?: any) {

    if (size(items) > 0) setItemValue(items, key);
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
      <Col span="10">
        <Diagnoses
          changeDiagnosesTemplate={changeDiagnosesTemplate}
          changePreeclampsia={changePreeclampsia}
          changePreventPreeclampsia={changePreventPreeclampsia}
          changeScreening={changeScreening}
          changeSyphilis={changeSyphilis}
          saveHeaderInfo={saveHeaderInfo}
          setDiagnosesList={setDiagnosesList}
          setDiagnosesWord={setDiagnosesWord}
          diagnosesWord={diagnosesWord}
          getHighriskDiagnosis={getHighriskDiagnosis}
          headerInfo={headerInfo}
          diagnosesList={diagnosesList}
          isShowDiagnosesTemplate={false}
          noshowlist={false}
          isShowDiagnosesTemplatets={false}
          visitData={visitData!}
          isAllPregnancies={false}

          getDiagnosesList={() => { }}

          disabled={!canSave}
          serialNo={serialNo}

          page={''}
        />
      </Col>
      <Col span="14">
        <div className="form-wrapper">
          <MyForm
            disabled_all={!canSave}
            config={zdFormConfig}
            value={visitData}
            getFormHandler={f => {
              set_formHandler(f)
              getFormHandler(f)
            }}
            submitChange={false}
          />
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
          </div>
        </div>
        {!noShowBtn && (
          <Space className="prenatal-visit-main_initial-btns">
            <Button size="large" onClick={handlePrint.bind(this, 'prenatalVisit')} icon={<PrinterOutlined />}>
              打印档案
            </Button>
            <Button size="large" onClick={handlePrint.bind(this, 'prenatalVisit1')} icon={<PrinterOutlined />}>
              打印病历
            </Button>
            <Button size="large" type="primary" disabled={!canSave} onClick={handleSubmit} icon={<SaveOutlined />}>
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

Object.assign(Index, { Title, Config, ClassName })
export default Index
