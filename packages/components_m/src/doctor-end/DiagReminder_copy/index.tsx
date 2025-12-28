import React, { Component } from 'react';
import { Button, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { cloneDeep, set, get, isArray, size, filter } from 'lodash';
import { api } from '@/pages/prenatal-visit/pregnancy/doctor-end/api';
import {
  setDiagnosesWord,
  changeDiagnosesTemplate,
  getDiagnosesList,
  getHighriskSign,
  getHighriskDiagnosis,
} from '@/actions/prenatal-visit';
import './index.less';
class Index extends Component {
  state = {
    reminderData: [],
  };

  async componentDidMount() {
    const { pregnancyData, closeModal } = this.props;
    const pregnancyId = get(pregnancyData, 'id');
    const res = await api.initial.autoCaseRecognition(pregnancyId);
    const resDiag = filter(res, (item) => item.type === 'ALERT_MISSED_DIAGNOSIS');

    if (isArray(resDiag) && resDiag.length > 0) {
      resDiag.forEach((item: any) => {
        set(item, 'visible', true);
      });
      this.setState({ reminderData: resDiag });
    } else {
      closeModal('isShowDiagReminder');
    }
  }

  resetReminderData = (index: number) => {
    const { reminderData } = this.state;
    const { closeModal } = this.props;
    const resetData = cloneDeep(reminderData);
    set(resetData[index], 'visible', false);
    this.setState({ reminderData: resetData });
    if (index === 0) closeModal('isShowDiagReminder');
  };

  handleCancel = async (item: any, index: number, bool: boolean) => {
    const { pregnancyData } = this.props;
    const pregnancyId = get(pregnancyData, 'id');
    if (bool) {
      await api.components.saveCaseIgnore([
        {
          caseName: item.remind,
          type: 'ALERT_MISSED_DIAGNOSIS',
          pregnancyId: pregnancyId,
        },
      ]);
    }
    this.resetReminderData(index);
  };

  handleOk = async (item: any, index: number) => {
    const {
      setDiagnosesWord,
      changeDiagnosesTemplate,
      diagnosesList,
      pregnancyData,
      getDiagnosesList,
      getHighriskSign,
      getHighriskDiagnosis,
      system,
    } = this.props;

    // const pregnancyId = get(pregnancyData, 'id');
    // const diag = { diagnosis: item.content };
    // const cloneList = cloneDeep(diagnosesList);
    // cloneList.push(diag);
    // await api.updatePregnancy({ diagnoses: cloneList, id: pregnancyId });
    // getDiagnosesList(pregnancyId);
    // get(system, 'config.openHighriskSign') && getHighriskSign(pregnancyId);
    // getHighriskDiagnosis(pregnancyId);
    // message.info('添加诊断成功！');

    setDiagnosesWord(item.content);
    changeDiagnosesTemplate(true);
    this.resetReminderData(index);
  };

  footer = (item: any, index: number) => {
    return (
      <div>
        <Button onClick={() => this.handleCancel(item, index, true)}>取消</Button>
        <Button type="primary" onClick={() => this.handleOk(item, index)}>
          确定
        </Button>
      </div>
    );
  };

  render() {
    const { reminderData } = this.state;
    const { isShowDiagReminder } = this.props;

    return size(reminderData) > 0
      ? reminderData.map((item: any, index: number) =>
          item.visible ? (
            <Modal
              className="diag-reminder-wrapper"
              maskClosable={false}
              visible={isShowDiagReminder}
              onCancel={() => this.handleCancel(item, index, false)}
              footer={this.footer(item, index)}
              title="请注意！"
            >
              <div className="reminder-msg">
                <span className="reminder-word">{item.remind}</span>
              </div>
              <div className="reminder-diag">{item.content}</div>
            </Modal>
          ) : null,
        )
      : null;
  }
}
const mapDisPathchToProps = {
  setDiagnosesWord,
  changeDiagnosesTemplate,
  getDiagnosesList,
  getHighriskSign,
  getHighriskDiagnosis,
};
export default connect(null, mapDisPathchToProps)(Index);
