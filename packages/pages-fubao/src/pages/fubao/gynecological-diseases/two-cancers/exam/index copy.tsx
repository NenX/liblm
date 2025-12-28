import React from 'react';
import { PanelWithChild } from '@lm_fe/components_m';
import BasicInfo from '../../../gynecological-diseases/two-cancers/edit';
import FollowUp from './components/FollowUp';
import CervicalCarcinoma from './components/CervicalCarcinoma';
import MammaryCancer from './components/MammaryCancer';
import InformedConsent from '../../../premarital-care/.public-exam/InformedConsent';
// import SurveyReport from './components/SurveyReport';
// import ImageReport from './components/ImageReport';
import { DoctorEnd_SurveyReport, DoctorEnd_ImageReport } from '@lm_fe/pages-mchc';

import { Space } from 'antd';
import { get, map } from 'lodash';
import { getSearchParamsValue, fubaoRequest as request } from '@lm_fe/utils';
import classnames from 'classnames';
import styles from './index.module.less';
console.log('PanelWithChild styles', PanelWithChild.styles)
const tabs = [
  {
    key: 'CervicalCarcinoma',
    title: '宫颈癌筛查',
  },
  {
    key: 'MammaryCancer',
    title: '乳腺癌筛查',
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
  // {
  //   key: 'CaseReport',
  //   title: '全景病历',
  // },
];

export default class panel extends PanelWithChild {
  constructor(props: any) {
    super(props);
    this.state = {
      data: {},
      activeKey: '',
    };
  }
  async componentDidMount() {
    const id = getSearchParamsValue('id');
    let data = id ? (await request.get(`/api/two/cancer/screening/getTwoCancerScreeningFile/page?id.equals=${id}`)).data : {};
    if (data) {
      data = get(data, 'data.pageData.0');
    }
    const activeKey = get(this.props, 'routerQuery.activeKey') || (__DEV__ ? 'MammaryCancer' : 'CervicalCarcinoma');
    this.setState({
      data,
      activeKey,
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
    this.setState({
      activeKey,
    });
  };
  getIcon = (tab: any) => {
    const { activeKey } = this.state;
    if (activeKey === tab.key) {
      return <div className={styles["circle-icon"]}></div>;
    }
    return null;
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
              {/* {this.getIcon(tab)} */}
              {tab.title}
            </Space>
          </div>
        ))}
      </div>
    );
  };
  renderContent = () => {
    const { basicInfo, system } = this.props as any;
    const id = getSearchParamsValue('id');
    const cervicalCancerScreeningId = get(this.props, 'routerQuery.cervicalCancerScreeningId');
    const breastCancerScreeningId = get(this.props, 'routerQuery.breastCancerScreeningId');
    const breastCancerXRayId = get(this.props, 'routerQuery.breastCancerXRayId');
    const { data, activeKey } = this.state;
    return (
      <div className={classnames([styles["hj-desk"], PanelWithChild.styles["panel-with-child-desk"]])}>
        {this.renderTabs()}
        <div className={PanelWithChild.styles["panel-with-child-desk-content"]}>
          {activeKey === 'CervicalCarcinoma' && (
            <CervicalCarcinoma
              id={id}
              basicInfo={basicInfo}
              basicData={data}
              system={system}
              cervicalCancerScreeningId={cervicalCancerScreeningId}
            />
          )}
          {activeKey === 'MammaryCancer' && (
            <MammaryCancer
              id={id}
              basicInfo={basicInfo}
              basicData={data}
              system={system}
              breastCancerScreeningId={breastCancerScreeningId}
              breastCancerXRayId={breastCancerXRayId}
            />
          )}
          {activeKey === 'SurveyReport' && <DoctorEnd_SurveyReport headerInfo={data as any} />}
          {activeKey === 'ImageReport' && <DoctorEnd_ImageReport headerInfo={data as any} />}
          {activeKey === 'InformedConsent' && <InformedConsent />}
          {activeKey === 'FollowUp' && <FollowUp />}
          {activeKey === 'BasicInfo' && <BasicInfo id={id} basicInfo={basicInfo} basicData={data} />}
        </div>
      </div>
    );
  };
}
