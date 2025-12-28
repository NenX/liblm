import { LoadingPlaceholder, PanelWithChild, PanelWithChildFC } from '@lm_fe/components_m';
import {
  getSearchParamsValue,
  //  fubaoRequest as
  request
} from '@lm_fe/utils';
import { Form } from 'antd';
import classnames from 'classnames';
import { get, map } from 'lodash';
import React, { useEffect, useState } from 'react';
import BasicInfo from '../../public-exam/BasicInfo';
import GynecologicalExam from '../../public-exam/GynecologicalExam';
import GynecologicalLabExam from '../../public-exam/GynecologicalLabExam';
import GynecologicalNote from '../../public-exam/GynecologicalNote';
import MaritalHistory from '../../public-exam/MaritalHistory';
import MenstrualHistory from '../../public-exam/MenstrualHistory';
import PhysicalExam from '../../public-exam/PhysicalExam';

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
export class panel extends PanelWithChild {
  constructor(props: any) {
    super(props);
    this.state = {
      data: {},
      activeKey: '',
    };
  }

  async componentDidMount() {
    this.handleClickTab('BasicInfo')();
  }

  handleClickTab = (activeKey: string) => async () => {
    const id = getSearchParamsValue('id');
    const data = await request.get(`/api/gynecological-visits/${id}`);
    this.setState({
      activeKey,
      data,
    });
  };

  renderHeader = () => {
    const { data } = this.state;
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


export function Old(props: any) {
  const id = props.id ?? getSearchParamsValue('id')
  const [form] = Form.useForm()
  const [data, setData] = useState<any>()
  const [activeKey, setActiveKey] = useState(getSearchParamsValue('activeKey') ?? 'BasicInfo')


  useEffect(() => {

    (async () => {

      let data: any;

      data = id ? (await await request.get(`/api/gynecological-visits/${id}`)).data : {};

      form.setFieldsValue(data)
      setData(data)

    })()
    return () => {

    }
  }, [])
  async function handleClickTab(key: any) {
    setActiveKey(key)

  };

  const h = [
    { title: '姓名', value: get(data, 'gynecologicalPatient.name') },
    { title: '年龄', value: get(data, 'gynecologicalPatient.age') },
    { title: '门诊号', value: get(data, 'gynecologicalPatient.outpatientNO') },
    // { title: '联系电话', value: get(data, 'gynecologicalPatient.telephone') },
  ]
  return <div style={{ background: '#fff', height: '100%', overflowY: 'scroll' }}>


    {
      data ? <PanelWithChildFC

        activeKey={activeKey}
        setActiveKey={handleClickTab}
        headerItems={h}

        tabItems={[

          // { key: 'wsgl', title: '文书管理', node: <InformedConsent id={id} /> },
          // { key: 'xjsf', title: '宣教随访', node: <FollowUp /> },
          { key: 'BasicInfo', title: '基本信息', node: <BasicInfo moduleName="gynecological-patients-basic-info" data={data} /> },
          { key: 'PhysicalExam', title: '体格检查', node: <PhysicalExam moduleName="gynecological-patients-physical-examination" data={data} /> },
          { key: 'GynecologicalLabExam', title: '实验室检查', node: <GynecologicalLabExam moduleName="gynecological-patients-premarital-exam" data={data} /> },
          { key: 'GynecologicalExam', title: '妇科检查', node: <GynecologicalExam moduleName="gynecological-patients-gynecological-exam" data={data} /> },
          { key: 'GynecologicalNote', title: '妇科病史', node: <GynecologicalNote moduleName="gynecological-patients-note" data={data} /> },
          { key: 'MenstrualHistory', title: '月经史', node: <MenstrualHistory moduleName="gynecological-patients-menstrual-history" data={data} /> },
          { key: 'MaritalHistory', title: '婚育史', node: <MaritalHistory moduleName="gynecological-patients-marital-history" data={data} /> },
        ]}
      /> : <LoadingPlaceholder />
    }
  </div>
}
