import React from 'react';
import { PanelWithChild } from '@lm_fe/components_m';
import PhysicalExam from '../../public-exam/PhysicalExam';
import MaritalHistory from '../../public-exam/MaritalHistory';
import MenstrualHistory from '../../public-exam/MenstrualHistory';
import GynecologicalExam from '../../public-exam/GynecologicalExam';
import GynecologicalLabExam from '../../public-exam/GynecologicalLabExam';
import GynecologicalNote from '../../public-exam/GynecologicalNote';
import BasicInfo from '../../public-exam/BasicInfo';
import classnames from 'classnames';
import { get, map } from 'lodash';
import { fubaoRequest as request } from '@lm_fe/utils';
import { connect } from 'react-redux';
const tabs = [
  {
    key: 'BasicInfo',
    title: '基本信息',
  },
  {
    key: 'PhysicalExam',
    title: '体格检查',
  },
  {
    key: 'GynecologicalLabExam',
    title: '实验室检查',
  },
  {
    key: 'GynecologicalExam',
    title: '妇科检查',
  },
  {
    key: 'GynecologicalNote',
    title: '妇科病史',
  },
  {
    key: 'MenstrualHistory',
    title: '月经史',
  },
  {
    key: 'MaritalHistory',
    title: '婚育史',
  },
];
export class Panel extends PanelWithChild {
  constructor(props: any) {
    super(props);
    this.state = {
      data: {},
      activeKey: '',
      id: undefined,
    };
  }

  async componentDidMount() {
    this.handleClickTab('BasicInfo')();
  }

  handleClickTab = (activeKey: string) => async () => {
    const { womenExamRecordsEditingId: id } = this.props;
    const patientId = get(this.props, 'routerQuery.patientId');
    let data = {};
    if (id) {
      data = await request.get(`/api/gynecological-visits/${id}`);
    } else if (patientId) {
      data = {
        gynecologicalPatient: await request.get(`/api/gynecological-patients/${patientId}`),
      };
    }
    this.setState({
      activeKey,
      data,
    });
  };

  renderHeader = () => {
    const { data } = this.state;
    console.log(data);
    return (
      <div className={PanelWithChild.styles["panel-with-child_header"]}>
        <div className={PanelWithChild.styles["panel-with-child_header-item"]}>
          <span className={PanelWithChild.styles["panel-with-child_header-item-label"]}>姓名:</span>
          <span className={PanelWithChild.styles["panel-with-child_header-item-value"]}>{get(data, 'gynecologicalPatient.name')}</span>
        </div>
        <div className={PanelWithChild.styles["panel-with-child_header-item"]}>
          <span className={PanelWithChild.styles["panel-with-child_header-item-label"]}>年龄:</span>
          <span className={PanelWithChild.styles["panel-with-child_header-item-value"]}>{get(data, 'gynecologicalPatient.age')}</span>
        </div>
        <div className={PanelWithChild.styles["panel-with-child_header-secend-item"]}>
          <span className={PanelWithChild.styles["panel-with-child_header-secend-item-label"]}>门诊号:</span>
          <span className={PanelWithChild.styles["panel-with-child_header-secend-item-value"]}>
            {get(data, 'gynecologicalPatient.outpatientNO')}
          </span>
        </div>
      </div>
    );
  };

  renderTabs = () => {
    const { activeKey } = this.state;

    return (
      <div className={PanelWithChild.styles["panel-with-child-desk-tabs"]}>
        {map(tabs, (tab) => (
          <div
            key={tab.key}
            onClick={this.handleClickTab(tab.key)}
            className={classnames(PanelWithChild.styles["panel-with-child-desk-tabs-item"], {
              [PanelWithChild.styles['panel-with-child-desk-tabs-item-active']]: activeKey === tab.key,
            })}
          >
            {tab.title}
          </div>
        ))}
      </div>
    );
  };

  renderContent = () => {
    const { data, activeKey } = this.state;
    return (
      <div className={PanelWithChild.styles["panel-with-child-desk"]}>
        {this.renderTabs()}
        <div className={PanelWithChild.styles["panel-with-child-desk-content"]}>
          {activeKey === 'BasicInfo' && <BasicInfo moduleName="gynecological-patients-basic-info" data={data} />}
          {activeKey === 'PhysicalExam' && (
            <PhysicalExam moduleName="gynecological-patients-physical-examination" data={data} />
          )}

          {activeKey === 'GynecologicalLabExam' && (
            <GynecologicalLabExam moduleName="gynecological-patients-premarital-exam" data={data} />
          )}
          {activeKey === 'GynecologicalExam' && (
            <GynecologicalExam moduleName="gynecological-patients-gynecological-exam" data={data} />
          )}
          {activeKey === 'GynecologicalNote' && (
            <GynecologicalNote moduleName="gynecological-patients-note" data={data} />
          )}
          {activeKey === 'MenstrualHistory' && (
            <MenstrualHistory moduleName="gynecological-patients-menstrual-history" data={data} />
          )}
          {activeKey === 'MaritalHistory' && (
            <MaritalHistory moduleName="gynecological-patients-marital-history" data={data} />
          )}
        </div>
      </div>
    );
  };
}
export default connect(({ tempIds }) => ({
  womenExamRecordsEditingId: get(tempIds, 'womenExamRecordsEditingId'),
}))(Panel);
