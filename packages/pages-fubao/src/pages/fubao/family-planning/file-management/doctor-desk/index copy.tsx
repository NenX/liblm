import { PanelWithChild } from '@lm_fe/components_m';
import { SLocal_State } from '@lm_fe/service';
import { getSearchParamsValue, fubaoRequest as request } from '@lm_fe/utils';
import { Space } from 'antd';
import classnames from 'classnames';
import { get, map } from 'lodash';
import React from 'react';
import InformedConsent from '../../../premarital-care/.public-exam/InformedConsent';
import BasicInfo from '../../file-management/nurse-desk';
import AppointModal from './AppointModal';
import FirstVisit from './components/FirstVisitv2';
import FollowUp from './components/FollowUp';
import ImageReport from './components/ImageReport';
import SurgicalRecord from './components/SurgicalRecordv2';
import SurveyReport from './components/SurveyReport';
import styles from './index.module.less';
const tabs = [
  {
    key: 'FirstVisit',
    title: '专科病历.',
  },
  {
    key: 'SurgicalRecord',
    title: '手术病历',
  },
  {
    key: 'SurveyReport',
    title: '检验检查',
  },
  {
    key: 'ImageReport',
    title: '影像报告',
  },
  // {
  //   key: 'InformedConsent',
  //   title: '文书管理',
  // },
  // {
  //   key: 'FollowUp',
  //   title: '宣教随访',
  // },
  {
    key: 'BasicInfo',
    title: '基本信息',
  },
  {
    key: 'PrenatalVisit',
    title: '围产保健',
  },
  {
    key: 'PrenatalDiagnosis',
    title: '产前诊断',
  },
];
// @ts-ignore
export default class FamilyPlanning_FileManagement_DoctorDesk extends PanelWithChild {
  constructor(props: any) {
    super(props);
    this.state = {
      data: {},
      activeKey: '',
      renderModal: false,
      domain: '',
    };
  }

  async componentDidMount() {
    const { isSingle } = this.props as any; //是否为单页

    let data: any;

    const id = isSingle ? get(this.props, 'id') : getSearchParamsValue('id');
    data = id ? (await request.get(`/api/family/planning/getFamilyPlanningFile/page?id.equals=${id}`)).data : {};
    console.log('isSingle fb', isSingle, data)
    //获取产科部署地址及端口API
    let res = (await request.get(`/api/family/planning/getObstetricsApi`)).data;

    if (data) {
      data = get(data, 'data.pageData.0');
    }
    const activeKey = get(this.props, 'routerQuery.activeKey') || 'FirstVisit';
    this.setState({
      data,
      activeKey,
      domain: get(res, 'data'),
    });
  }

  renderHeader = () => {
    const { data } = this.state;
    return (
      <div className={PanelWithChild.styles["panel-with-child_header"]}>
        <div className={PanelWithChild.styles["panel-with-child_header-item"]}>
          <span className={PanelWithChild.styles["panel-with-child_header-item-label"]}>姓名:</span>
          <span className={PanelWithChild.styles["panel-with-child_header-item-value"]}>{get(data, 'name')}</span>
        </div>
        <div className={PanelWithChild.styles["panel-with-child_header-item"]}>
          <span className={PanelWithChild.styles["panel-with-child_header-item-label"]}>性别:</span>
          <span className={PanelWithChild.styles["panel-with-child_header-item-value"]}>女</span>
        </div>
        <div className={PanelWithChild.styles["panel-with-child_header-item"]}>
          <span className={PanelWithChild.styles["panel-with-child_header-item-label"]}>年龄:</span>
          <span className={PanelWithChild.styles["panel-with-child_header-item-value"]}>{get(data, 'age')}</span>
        </div>
        <div className={PanelWithChild.styles["panel-with-child_header-secend-item"]}>
          <span className={PanelWithChild.styles["panel-with-child_header-secend-item-label"]}>门诊号:</span>
          <span className={PanelWithChild.styles["panel-with-child_header-secend-item-value"]}>{get(data, 'outpatientNo')}</span>
        </div>
      </div>
    );
  };

  handleClickTab = (activeKey: any) => async () => {
    const { data, domain } = this.state;
    const { user } = this.props as any;
    if (activeKey === 'PrenatalDiagnosis') {
      const prenatalDiagnosisUrl = `http://${domain}/single/pd?moduleName=prenatalDiagnosisV2&patId=${get(
        data,
        'outpatientNo',
      )}&empId=${get(user, 'basicInfo.login')}`;
      window.open(prenatalDiagnosisUrl, '_blank');
      // const idNO = get(data, 'idNO');
      // const res = await request.get(`/api/prenatal-patients?idNO.equals=${idNO}`);

      // if (!isEmpty(res)) {
      //   const outpatientNO = get(res, '0.outpatientNO');
      //   const prenatalDiagnosisUrl = `/single/pd?moduleName=prenatalDiagnosisV2&patId=${outpatientNO}&empId=${get(
      //     user,
      //     'basicInfo.login',
      //   )}`;
      //   ///single/pd?moduleName=prenatalDiagnosisV2&patId=74959682728&data={"serialNo":"39"}&empId=admin_cq
      //   window.open(prenatalDiagnosisUrl, '_blank');
      // } else {
      //   message.warning('该用户未在产前诊断建档！');
      // }
    } else if (activeKey === 'PrenatalVisit') {
      const prenatalVisitUrl = `http://${domain}/single/obout?patId=${get(data, 'outpatientNo')}&empId=${get(
        user,
        'basicInfo.login',
      )}`;
      window.open(prenatalVisitUrl, '_blank');
      // const idNO = get(data, 'idNO');
      // const res = await request.get(`/api/pregnancies?idNO.equals=${idNO}`);
      // if (!isEmpty(res)) {
      //   const outpatientNO = get(res, '0.outpatientNO');
      //   const prenatalVisitUrl = `/single/obout?patId=${outpatientNO}&empId=${get(user, 'basicInfo.login')}`;
      //   ///single/obout?patId=74959682728&empId=kevin
      //   window.open(prenatalVisitUrl, '_blank');
      // } else {
      //   message.warning('该用户未在围产保健建档！');
      // }
    } else {
      this.setState({
        activeKey,
      });
    }
  };

  getIcon = (tab: any) => {
    const { activeKey } = this.state;
    if (activeKey === tab.key) {
      return <div className={styles["circle-icon"]}></div>;
    }
    return null;
  };

  handleCancel = () => {
    this.setState({ renderModal: false });
  };

  handleRenderModal = () => {
    this.setState({ renderModal: true });
  };

  renderTabs = () => {
    const { activeKey } = this.state;

    return (
      <div className={PanelWithChild.styles["panel-with-child-desk-tabs"]}>
        {map(tabs, (tab) => (
          <div
            key={tab.key}
            onClick={this.handleClickTab(tab.key)}
            className={classnames(PanelWithChild.styles['panel-with-child-desk-tabs-item'], {
              [PanelWithChild.styles['panel-with-child-desk-tabs-item-active']]: activeKey === tab.key,
            })}
          >
            <Space>
              {this.getIcon(tab)}
              {tab.title}
            </Space>
          </div>
        ))}
      </div>
    );
  };

  renderContent = () => {
    // const { basicInfo } = this.props as any;
    const basicInfo = SLocal_State.getUserData()

    const { data, activeKey, renderModal } = this.state;
    const id = get(data, 'id') || getSearchParamsValue('id');

    const surgicalRecordId = get(this.props, 'routerQuery.surgicalRecordId');
    return (
      <div className={classnames([styles["hj-desk"], PanelWithChild.styles["panel-with-child-desk"]])}>
        {this.renderTabs()}
        <div className={PanelWithChild.styles["panel-with-child-desk-content"]}>
          {activeKey === 'FirstVisit' && <FirstVisit id={id} basicInfo={basicInfo} data={data} />}
          {activeKey === 'SurgicalRecord' && (
            <SurgicalRecord id={id} basicInfo={basicInfo} basicData={data} surgicalRecordId={surgicalRecordId} />
          )}

          {activeKey === 'SurveyReport' && <SurveyReport headerInfoOfInpatientData={data} />}
          {activeKey === 'ImageReport' && <ImageReport headerInfoOfInpatientData={data} />}
          {activeKey === 'InformedConsent' && <InformedConsent id={id} />}
          {activeKey === 'FollowUp' && <FollowUp />}
          {activeKey === 'BasicInfo' && <BasicInfo id={id} basicInfo={basicInfo} data={data} />}
        </div>
        <div className={styles["operation-appointment"]} onClick={this.handleRenderModal}>
          <div className={styles["title"]}>手术预约</div>
          <div className={styles["icon"]}></div>
        </div>
        {renderModal && <AppointModal visible={renderModal} onCancel={this.handleCancel} basicData={data} />}
      </div>
    );
  };
}
